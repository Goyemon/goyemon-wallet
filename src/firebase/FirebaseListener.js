'use strict';
import BigNumber from 'bignumber.js';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import {
  saveCDaiBalance,
  saveDaiBalance,
  saveDaiSavingsBalance,
  saveWeiBalance
} from '../actions/ActionBalance';
import { saveCDaiLendingInfo, saveDaiApprovalInfo } from '../actions/ActionCDaiLendingInfo';
import { saveTransactionCount, incrementTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updateWithPendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import EtherUtilities from '../utilities/EtherUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import FcmMsgsParser from './FcmMsgsParser.js';
import { store } from '../store/store';

firebase.messaging().onMessage(downstreamMessage => {
  const stateTree = store.getState();
  const balance = stateTree.ReducerBalance.balance;
  const cDaiLendingInfo = stateTree.ReducerCDaiLendingInfo.cDaiLendingInfo;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;

  if (downstreamMessage.data.type === 'balance') {
    const balanceMessage = JSON.parse(downstreamMessage.data.data);
    if (balanceMessage.hasOwnProperty('eth')) {
      const weiBalance = parseInt(balanceMessage.eth, 16);
      store.dispatch(saveWeiBalance(weiBalance));
    }
    if (balanceMessage.hasOwnProperty('dai')) {
      const daiBalance = parseInt(balanceMessage.dai, 16);
      store.dispatch(saveDaiBalance(daiBalance));
    }
    if (balanceMessage.hasOwnProperty('cdai')) {
      const cDaiBalance = parseInt(balanceMessage.cdai, 16);
      store.dispatch(saveCDaiBalance(cDaiBalance));
      store.dispatch(saveDaiSavingsBalance(cDaiBalance, cDaiLendingInfo.currentExchangeRate));
    }
  } else if (downstreamMessage.data.type === 'txhistory') {
    if (downstreamMessage.data.data === '{}') {
      store.dispatch(saveEmptyTransaction(downstreamMessage.data.data));
      store.dispatch(saveTransactionCount(0));
    }

    FcmMsgsParser.fcmMsgsSaver(downstreamMessage.data);
    const stateTree = store.getState();
    const fcmMsgs = stateTree.ReducerFcmMsgs.fcmMsgs;
    if (fcmMsgs[downstreamMessage.data.uid] != undefined) {
      if (fcmMsgs[downstreamMessage.data.uid].length === parseInt(downstreamMessage.data.count)) {
        const transactions = FcmMsgsParser.fcmMsgsToTransactions(downstreamMessage.data);
        const parsedExistingTransactions = TransactionUtilities.parseExistingTransactions(
          transactions
        );
        store.dispatch(saveExistingTransactions(parsedExistingTransactions));
        store.dispatch(saveTransactionCount(parsedExistingTransactions.length));
      }
    }
  } else if (downstreamMessage.data.type === 'txstate') {
    const txStateMessage = JSON.parse(downstreamMessage.data.data);
    const isPendingState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 1;
    const isIncludedState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 2;
    const isConfirmedState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 3;
    if (isPendingState) {
      const parsedTransaction = TransactionUtilities.parsePendingOrIncludedTransaction(
        txStateMessage
      );
      const transactionsExist = Array.isArray(transactionsHistory);
      if (transactionsExist) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === parsedTransaction.hash
        );
        const isIncomingEthTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.to);
        const isDaiTransfer = parsedTransaction.hasOwnProperty('dai_tr');
        let isIncomingDaiTx;
        if (isDaiTransfer) {
          const isIncomingDaiTx =
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.dai_tr.to);
        }
        const isIncomingTx = isIncomingEthTx || isIncomingDaiTx;

        if (!txHashExist && isIncomingTx) {
          store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
          store.dispatch(incrementTransactionCount());
        }

        transactionsHistory.map(transaction => {
          const isOutgoingTx =
            transaction.from === Web3.utils.toChecksumAddress(parsedTransaction.from);
          const nonceExist = transaction.nonce === parsedTransaction.nonce;
          if (
            isOutgoingTx &&
            nonceExist &&
            !(transaction.state === 'included') &&
            !(transaction.state === 'confirmed')
          ) {
            store.dispatch(updateWithPendingOrIncludedTransaction(parsedTransaction));
          }
        });
      }
    } else if (isIncludedState) {
      const parsedTransaction = TransactionUtilities.parsePendingOrIncludedTransaction(
        txStateMessage
      );
      const transactionsExist = Array.isArray(transactionsHistory);
      if (transactionsExist) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === parsedTransaction.hash
        );
        const isIncomingEthTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.to);
        const isDaiTransfer = parsedTransaction.hasOwnProperty('dai_tr');
        let isIncomingDaiTx;
        if (isDaiTransfer) {
          isIncomingDaiTx =
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.dai_tr.to);
        }
        const isIncomingTx = isIncomingEthTx || isIncomingDaiTx;

        if (!txHashExist && isIncomingTx) {
          store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
          store.dispatch(incrementTransactionCount());
        }

        transactionsHistory.map(transaction => {
          const isOutgoingTx =
            transaction.from === Web3.utils.toChecksumAddress(parsedTransaction.from);
          const nonceExist = transaction.nonce === parsedTransaction.nonce;
          if (isOutgoingTx && nonceExist && !(transaction.state === 'confirmed')) {
            store.dispatch(updateWithPendingOrIncludedTransaction(parsedTransaction));
          }
          const hashExist = transaction.hash === parsedTransaction.hash;
          if (hashExist && !(transaction.state === 'confirmed')) {
            store.dispatch(updateTransactionState(parsedTransaction));
          }
        });
      }
    } else if (isConfirmedState) {
      const parsedTransaction = TransactionUtilities.parseConfirmedTransaction(txStateMessage);
      const transactionsExist = Array.isArray(transactionsHistory);
      if (transactionsExist) {
        transactionsHistory.map(transaction => {
          const hashExist = transaction.hash === parsedTransaction.hash;
          if (hashExist) {
            store.dispatch(updateTransactionState(parsedTransaction));
          }
        });
      }
    }
  } else if (downstreamMessage.data.type === 'cDai_lending_info') {
    const cDaiLendingInfoMessage = JSON.parse(downstreamMessage.data.data);
    store.dispatch(saveCDaiLendingInfo(cDaiLendingInfoMessage));
    store.dispatch(
      saveDaiSavingsBalance(balance.cDaiBalance, cDaiLendingInfoMessage.current_exchange_rate)
    );
  }
});
