'use strict';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import { saveEthBalance, saveDaiBalance } from '../actions/ActionBalance';
import { saveTransactionCount, incrementTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updatePendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import EtherUtilities from '../utilities/EtherUtilities.js';
import { store } from '../store/store';

firebase.messaging().onMessage(downstreamMessage => {
  const stateTree = store.getState();
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

  console.log("downstreamMessage ===>", downstreamMessage);

  if (downstreamMessage.data.type === 'balance') {
    if (downstreamMessage.data.hasOwnProperty('eth')) {
      const ethBalanceInWei = parseInt(downstreamMessage.data.eth, 16);
      const balanceInEther = Web3.utils.fromWei(ethBalanceInWei.toString());
      const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
      store.dispatch(saveEthBalance(roundedBalanceInEther));
    }
    if (downstreamMessage.data.hasOwnProperty('ame_ropsten')) {
      let daiBalance = parseInt(downstreamMessage.data.ame_ropsten, 16) / 10 ** 18;
      daiBalance = daiBalance.toFixed(2);
      store.dispatch(saveDaiBalance(daiBalance));
    }
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count != '0') {
    const transactions = JSON.parse(downstreamMessage.data.items);
    store.dispatch(saveExistingTransactions(transactions));
    store.dispatch(saveTransactionCount(downstreamMessage.data.count));
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count === '0') {
    store.dispatch(saveEmptyTransaction(downstreamMessage.data.items));
    store.dispatch(saveTransactionCount(downstreamMessage.data.count));
  } else if (downstreamMessage.data.type === 'txstate') {
    if (downstreamMessage.data.state === 'pending') {
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === downstreamMessage.data.txhash
        );
        if(downstreamMessage.data.hasOwnProperty('txto')){
          if (
            checksumAddress ===
              Web3.utils.toChecksumAddress(downstreamMessage.data.txto) &&
            txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              store.dispatch(incrementTransactionCount());
          }
        }
        if(downstreamMessage.data.hasOwnProperty('ame_ropsten')){
          if (
            checksumAddress === Web3.utils.toChecksumAddress(JSON.parse(downstreamMessage.data.ame_ropsten).to) &&
            txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              store.dispatch(incrementTransactionCount());
          }
        }
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.from ===
            Web3.utils.toChecksumAddress(downstreamMessage.data.txfrom)
          ) {
            if(transaction.nonce === parseInt(downstreamMessage.data.nonce, 16) &&
            !(transaction.state === 'included') &&
            !(transaction.state === 'confirmed')
          ) {
              store.dispatch(updatePendingOrIncludedTransaction(downstreamMessage.data));
            }
          }
        });
      }
    } else if (downstreamMessage.data.state === 'included') {
      if (Array.isArray(transactionsHistory)) {
        const txHashExist = transactionsHistory.some(
          transaction => transaction.hash === downstreamMessage.data.txhash
        );
        if(downstreamMessage.data.hasOwnProperty('txto')) {
          if (
            (checksumAddress ===
              Web3.utils.toChecksumAddress(downstreamMessage.data.txto) &&
              txHashExist === false)
          ) {
              store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              store.dispatch(incrementTransactionCount());
            }
        }
        if(downstreamMessage.data.hasOwnProperty('ame_ropsten')){
          if (
              checksumAddress === Web3.utils.toChecksumAddress(JSON.parse(downstreamMessage.data.ame_ropsten).to) &&
              txHashExist === false
          ) {
              store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              store.dispatch(incrementTransactionCount());
            }
        }

      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.from ===
            Web3.utils.toChecksumAddress(downstreamMessage.data.txfrom) &&
            transaction.nonce === parseInt(downstreamMessage.data.nonce, 16) &&
            transaction.state === 'sent'
          ) {
            store.dispatch(updatePendingOrIncludedTransaction(downstreamMessage.data));
          }
        });
      }

      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.hash === downstreamMessage.data.txhash &&
            !(transaction.state === 'confirmed')
          ) {
            store.dispatch(updateTransactionState(downstreamMessage.data));
          }
        });
      }

    } else if (downstreamMessage.data.state === 'confirmed') {
      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (
            transaction.hash === downstreamMessage.data.txhash
          ) {
            store.dispatch(updateTransactionState(downstreamMessage.data));
          }
        });
      }
    }
  }
});
