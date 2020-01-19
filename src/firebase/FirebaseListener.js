'use strict';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import { saveEthBalance, saveDaiBalance } from '../actions/ActionBalance';
import { saveCDaiLendingInfo } from '../actions/ActionCDaiLendingInfo';
import { saveTransactionCount, incrementTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updatePendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import EtherUtilities from '../utilities/EtherUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import FcmMsgsParser from './FcmMsgsParser.js';
import { store } from '../store/store';

firebase.messaging().onMessage(downstreamMessage => {
  const stateTree = store.getState();
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

  if (downstreamMessage.data.type === 'balance') {
    const balanceMessage = JSON.parse(downstreamMessage.data.data);
    if (balanceMessage.hasOwnProperty('eth')) {
      const ethBalanceInWei = parseInt(balanceMessage.eth, 16);
      const balanceInEther = Web3.utils.fromWei(ethBalanceInWei.toString());
      const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
      store.dispatch(saveEthBalance(roundedBalanceInEther));
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
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === parsedTransaction.hash
        );
        if (parsedTransaction.state != 'confirmed') {
          if (
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.txto) &&
            txHashExist === false
          ) {
            store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
            store.dispatch(incrementTransactionCount());
          }
        }
        if (parsedTransaction.hasOwnProperty('ame_ropsten')) {
          if (
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.ame_ropsten.to) &&
            txHashExist === false
          ) {
            store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
            store.dispatch(incrementTransactionCount());
          }
        }
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (transaction.from === Web3.utils.toChecksumAddress(parsedTransaction.from)) {
            if (
              transaction.nonce === parsedTransaction.nonce &&
              !(transaction.state === 'included') &&
              !(transaction.state === 'confirmed')
            ) {
              store.dispatch(updatePendingOrIncludedTransaction(parsedTransaction));
            }
          }
        });
      }
    } else if (isIncludedState) {
      const parsedTransaction = TransactionUtilities.parsePendingOrIncludedTransaction(
        txStateMessage
      );
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === parsedTransaction.hash
        );
        if (parsedTransaction.state != 'confirmed') {
          if (
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.to) &&
            txHashExist === false
          ) {
            store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
            store.dispatch(incrementTransactionCount());
          }
        }
        if (parsedTransaction.hasOwnProperty('ame_ropsten')) {
          if (
            checksumAddress === Web3.utils.toChecksumAddress(parsedTransaction.ame_ropsten.to) &&
            txHashExist === false
          ) {
            store.dispatch(addPendingOrIncludedTransaction(parsedTransaction));
            store.dispatch(incrementTransactionCount());
          }
        }
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.from === Web3.utils.toChecksumAddress(parsedTransaction.from) &&
            transaction.nonce === parsedTransaction.nonce &&
            transaction.state === 'sent'
          ) {
            store.dispatch(updatePendingOrIncludedTransaction(parsedTransaction));
          }
        });
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (transaction.hash === parsedTransaction.hash && !(transaction.state === 'confirmed')) {
            store.dispatch(updateTransactionState(parsedTransaction));
          }
        });
      }
    } else if (isConfirmedState) {
      const parsedTransaction = TransactionUtilities.parseConfirmedTransaction(txStateMessage);
      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (transaction.hash === parsedTransaction.hash) {
            store.dispatch(updateTransactionState(parsedTransaction));
          }
        });
      }
    }
  } else if (downstreamMessage.data.type === 'cDai_lending_info') {
    const cDaiLendingInfoMessage = JSON.parse(downstreamMessage.data.data);
    store.dispatch(saveCDaiLendingInfo(cDaiLendingInfoMessage));
    store.dispatch(saveDaiSavingsBalance(balance.cDaiBalance, cDaiLendingInfoMessage.current_exchange_rate));
  }
});
