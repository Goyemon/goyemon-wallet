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
import {
  saveTotalTransactions,
  incrementTotalTransactions
} from '../actions/ActionTotalTransactions';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updateWithPendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import DebugUtilities from '../utilities/DebugUtilities.js';
import EtherUtilities from '../utilities/EtherUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import FcmMsgsParser from './FcmMsgsParser.js';
import { store } from '../store/store';

export default async downstreamMessage => {
  const stateTree = store.getState();
  const balance = stateTree.ReducerBalance.balance;
  const cDaiLendingInfo = stateTree.ReducerCDaiLendingInfo.cDaiLendingInfo;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;

  DebugUtilities.logInfo('downstreamMessage ===>', downstreamMessage);

  if (downstreamMessage.data.type === 'balance') {
    const balanceMessage = JSON.parse(downstreamMessage.data.data);
    if (balanceMessage.hasOwnProperty('eth')) {
      let weiBalance = new BigNumber(balanceMessage.eth);
      weiBalance = weiBalance.toString(10);
      store.dispatch(saveWeiBalance(weiBalance));
    }
    if (balanceMessage.hasOwnProperty('dai')) {
      let daiBalance = new BigNumber(balanceMessage.dai);
      daiBalance = daiBalance.toString(10);
      store.dispatch(saveDaiBalance(daiBalance));
    }
    if (balanceMessage.hasOwnProperty('cdai')) {
      FcmUpstreamMsgs.requestCDaiLendingInfo(this.props.checksumAddress);

      let cDaiBalance = new BigNumber(balanceMessage.cdai);
      cDaiBalance = cDaiBalance.toString(10);
      store.dispatch(saveCDaiBalance(cDaiBalance));
    }
  } else if (downstreamMessage.data.type === 'txhistory') {
    if (downstreamMessage.data.data === '{}') {
      store.dispatch(saveEmptyTransaction(downstreamMessage.data.data));
      store.dispatch(saveTotalTransactions(0));
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
        store.dispatch(saveTotalTransactions(parsedExistingTransactions.length));
        store.dispatch(
          saveDaiApprovalInfo(TransactionUtilities.isDaiApproved(parsedExistingTransactions))
        );
      }
    }
  } else if (downstreamMessage.data.type === 'txstate') {
    let txStateMessages = JSON.parse(downstreamMessage.data.data);
    txStateMessages = Object.entries(txStateMessages).map(e => ({ [e[0]]: e[1] }));
    txStateMessages.map(txStateMessage => {
      const isPendingState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 1;
      const isIncludedState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 2;
      const isConfirmedState = txStateMessage[Object.keys(txStateMessage)[0]][7] === 3;
      if (isPendingState) {
        const parsedTxStateMessage = TransactionUtilities.parsePendingOrIncludedTransaction(
          txStateMessage
        );
        const transactionsExist = Array.isArray(transactionsHistory);
        let txHashExist;
        let nonceExistWhereStateIsNotIncludedOrConfirmed;
        if (transactionsExist) {
          txHashExist = transactionsHistory.some(
            transaction => transaction.hash === parsedTxStateMessage.hash
          );
          nonceExistWhereStateIsNotIncludedOrConfirmed = transactionsHistory.some(
            transaction =>
              transaction.nonce === parsedTxStateMessage.nonce &&
              !(transaction.state === 'included' || transaction.state === 'confirmed')
          );
        }
        const isIncomingEthTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.to);
        const isDaiTransfer = parsedTxStateMessage.hasOwnProperty('dai_tr');
        let isIncomingDaiTx;
        if (isDaiTransfer) {
          isIncomingDaiTx =
            checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.dai_tr.to);
        }
        const isIncomingTx = isIncomingEthTx || isIncomingDaiTx;
        const isOutgoingTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.from);

        if (nonceExistWhereStateIsNotIncludedOrConfirmed && isOutgoingTx) {
          store.dispatch(updateWithPendingOrIncludedTransaction(parsedTxStateMessage));
        } else if (!txHashExist && isIncomingTx) {
          store.dispatch(addPendingOrIncludedTransaction(parsedTxStateMessage));
          store.dispatch(incrementTotalTransactions());
        } else {
          DebugUtilities.logInfo('unknown transaction');
        }
      } else if (isIncludedState) {
        const parsedTxStateMessage = TransactionUtilities.parsePendingOrIncludedTransaction(
          txStateMessage
        );
        const transactionsExist = Array.isArray(transactionsHistory);
        let txHashExist;
        let txHashExistWhereStateIsNotConfirmed;
        let nonceExistWhereStateIsNotConfirmed;
        if (transactionsExist) {
          txHashExist = transactionsHistory.some(
            transaction => transaction.hash === parsedTxStateMessage.hash
          );
          txHashExistWhereStateIsNotConfirmed = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedTxStateMessage.hash && !(transaction.state === 'confirmed')
          );
          nonceExistWhereStateIsNotConfirmed = transactionsHistory.some(
            transaction =>
              transaction.nonce === parsedTxStateMessage.nonce &&
              !(transaction.state === 'confirmed')
          );
        }
        const isIncomingEthTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.to);
        const isDaiTransfer = parsedTxStateMessage.hasOwnProperty('dai_tr');
        let isIncomingDaiTx;
        if (isDaiTransfer) {
          isIncomingDaiTx =
            checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.dai_tr.to);
        }
        const isIncomingTx = isIncomingEthTx || isIncomingDaiTx;
        const isOutgoingTx =
          checksumAddress === Web3.utils.toChecksumAddress(parsedTxStateMessage.from);

        if (nonceExistWhereStateIsNotConfirmed && isOutgoingTx) {
          store.dispatch(updateWithPendingOrIncludedTransaction(parsedTxStateMessage));
        } else if (!txHashExist && isIncomingTx) {
          store.dispatch(addPendingOrIncludedTransaction(parsedTxStateMessage));
          store.dispatch(incrementTotalTransactions());
        } else if (txHashExistWhereStateIsNotConfirmed) {
          store.dispatch(updateTransactionState(parsedTxStateMessage));
        } else {
          DebugUtilities.logInfo('unknown transaction');
        }
      } else if (isConfirmedState) {
        const parsedTxStateMessage = TransactionUtilities.parseConfirmedTransaction(txStateMessage);
        const transactionsExist = Array.isArray(transactionsHistory);
        if (transactionsExist) {
          const txHashExist = transactionsHistory.some(
            transaction => transaction.hash === parsedTxStateMessage.hash
          );
          if (txHashExist) {
            store.dispatch(updateTransactionState(parsedTxStateMessage));
          }
        } else {
          DebugUtilities.logInfo("a transaction doesn't exist");
        }
      }
    });
  } else if (downstreamMessage.data.type === 'cDai_lending_info') {
    const cDaiLendingInfoMessage = JSON.parse(downstreamMessage.data.data);
    store.dispatch(saveCDaiLendingInfo(cDaiLendingInfoMessage));
    store.dispatch(
      saveDaiSavingsBalance(balance.cDaiBalance, cDaiLendingInfoMessage.current_exchange_rate)
    );
  }

  return Promise.resolve();
};
