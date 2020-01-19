'use strict';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import { saveDaiBalance, saveEthBalance } from '../actions/ActionBalance';
import { saveCDaiLendingInfo } from '../actions/ActionCDaiLendingInfo';
import { incrementTransactionCount, saveTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updatePendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import EtherUtilities from '../utilities/EtherUtilities.js';
import FcmMsgsParser from './FcmMsgsParser.js';
import { store } from '../store/store';

export default async message => {
  const stateTree = store.getState();
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

  if (message.data.type === 'balance') {
    const balanceMessage = JSON.parse(message.data.data);
    if (balanceMessage.hasOwnProperty('eth')) {
      const ethBalanceInWei = parseInt(balanceMessage.eth, 16);
      const balanceInEther = Web3.utils.fromWei(ethBalanceInWei.toString());
      const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
      store.dispatch(saveEthBalance(roundedBalanceInEther));
    }
    if (balanceMessage.hasOwnProperty('ame_ropsten')) {
      let daiBalance = parseInt(balanceMessage.ame_ropsten, 16) / 10 ** 18;
      daiBalance = daiBalance.toFixed(2);
      store.dispatch(saveDaiBalance(daiBalance));
    }
  } else if (message.data.type === 'txhistory') {
    if (message.data.data === '{}') {
      store.dispatch(saveEmptyTransaction(message.data.data));
    if (balanceMessage.hasOwnProperty('cdai')) {
      const cDaiBalance = parseInt(balanceMessage.cdai, 16);
      store.dispatch(saveCDaiBalance(cDaiBalance));
      store.dispatch(saveDaiSavingsBalance(cDaiBalance, cDaiLendingInfo.currentExchangeRate));
    }
      store.dispatch(saveTransactionCount(0));
    }

    FcmMsgsParser.fcmMsgsSaver(message.data);
    const stateTree = store.getState();
    const fcmMsgs = stateTree.ReducerFcmMsgs.fcmMsgs;
    if (fcmMsgs[message.data.uid] != undefined) {
      if (fcmMsgs[message.data.uid].length === parseInt(message.data.count)) {
        const transactions = FcmMsgsParser.fcmMsgsToTransactions(message.data);
        const parsedExistingTransactions = TransactionUtilities.parseExistingTransactions(
          transactions
        );
        store.dispatch(saveExistingTransactions(parsedExistingTransactions));
        store.dispatch(saveTransactionCount(parsedExistingTransactions.length));
      }
    }
  } else if (message.data.type === 'txstate') {
    const txStateMessage = JSON.parse(message.data.data);
    if (txStateMessage[Object.keys(txStateMessage)[0]][7] === 1) {
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
    } else if (txStateMessage[Object.keys(txStateMessage)[0]][7] === 2) {
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
    } else if (txStateMessage[Object.keys(txStateMessage)[0]][7] === 3) {
      const parsedTransaction = TransactionUtilities.parseConfirmedTransaction(txStateMessage);
      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (transaction.hash === parsedTransaction.hash) {
            store.dispatch(updateTransactionState(parsedTransaction));
          }
        });
      }
    }
  } else if (message.data.type === 'cDai_lending_info') {
    const cDaiLendingInfoMessage = JSON.parse(message.data.data);
    store.dispatch(saveCDaiLendingInfo(cDaiLendingInfoMessage));
    store.dispatch(
      saveDaiSavingsBalance(balance.cDaiBalance, cDaiLendingInfoMessage.current_exchange_rate)
    );
  }

  return Promise.resolve();
};
