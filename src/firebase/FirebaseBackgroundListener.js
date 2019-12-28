'use strict';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import { saveDaiBalance, saveEthBalance } from '../actions/ActionBalance';
import { incrementTransactionCount, saveTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updatePendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import EtherUtilities from '../utilities/EtherUtilities.js';
import { store } from '../store/store';

export default async (message) => {
  const stateTree = store.getState();
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

  console.log("message ===>", message);

  if (message.data.type === 'balance') {
    if (message.data.hasOwnProperty('eth')) {
      const ethBalanceInWei = parseInt(message.data.eth, 16);
      const balanceInEther = Web3.utils.fromWei(ethBalanceInWei.toString());
      const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
      store.dispatch(saveEthBalance(roundedBalanceInEther));
    }
    if (message.data.hasOwnProperty('ame_ropsten')) {
      let daiBalance = parseInt(message.data.ame_ropsten, 16) / 10 ** 18;
      daiBalance = daiBalance.toFixed(2);
      store.dispatch(saveDaiBalance(daiBalance));
    }
  } else if (message.data.type === 'txhistory' && message.data.count != '0') {
    const transactions = JSON.parse(message.data.items);
    store.dispatch(saveExistingTransactions(transactions));
    store.dispatch(saveTransactionCount(message.data.count));
  } else if (message.data.type === 'txhistory' && message.data.count === '0') {
    store.dispatch(saveEmptyTransaction(message.data.items));
    store.dispatch(saveTransactionCount(message.data.count));
  } else if (message.data.type === 'txstate') {
    if (message.data.state === 'pending') {
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === message.data.txhash
        );
        if(message.data.hasOwnProperty('txto')){
          if (
            checksumAddress ===
              Web3.utils.toChecksumAddress(message.data.txto) &&
            txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(message.data));
              store.dispatch(incrementTransactionCount());
          }
        }
        if(message.data.hasOwnProperty('ame_ropsten')){
          if (
            checksumAddress === Web3.utils.toChecksumAddress(JSON.parse(message.data.ame_ropsten).to) &&
            txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(message.data));
              store.dispatch(incrementTransactionCount());
          }
        }
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.from ===
            Web3.utils.toChecksumAddress(message.data.txfrom)
          ) {
            if(transaction.nonce === parseInt(message.data.nonce, 16) &&
            !(transaction.state === 'included') &&
            !(transaction.state === 'confirmed')
          ) {
              store.dispatch(updatePendingOrIncludedTransaction(message.data));
            }
          }
        });
      }
    } else if (message.data.state === 'included') {
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === message.data.txhash
        );
        if(message.data.hasOwnProperty('txto')) {
          if (
            (checksumAddress ===
              Web3.utils.toChecksumAddress(message.data.txto) &&
              txHashExist === false)
          ) {
              store.dispatch(addPendingOrIncludedTransaction(message.data));
              store.dispatch(incrementTransactionCount());
            }
        }
        if(message.data.hasOwnProperty('ame_ropsten')){
          if (
              checksumAddress === Web3.utils.toChecksumAddress(JSON.parse(message.data.ame_ropsten).to) &&
              txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(message.data));
              store.dispatch(incrementTransactionCount());
            }
        }

      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.from ===
            Web3.utils.toChecksumAddress(message.data.txfrom) &&
            transaction.nonce === parseInt(message.data.nonce, 16) &&
            transaction.state === 'sent'
          ) {
            store.dispatch(updatePendingOrIncludedTransaction(message.data));
          }
        });
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.hash === message.data.txhash &&
            !(transaction.state === 'confirmed')
          ) {
            store.dispatch(updateTransactionState(message.data));
          }
        });
      }

    } else if (message.data.state === 'confirmed') {
      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.hash === message.data.txhash
          ) {
            store.dispatch(updateTransactionState(message.data));
          }
        });
      }
    }
  }

  return Promise.resolve();
}
