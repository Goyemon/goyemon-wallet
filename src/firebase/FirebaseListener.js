'use strict';
import firebase from 'react-native-firebase';
import { store } from '../store/store';
import { saveEthBalance, saveDaiBalance } from '../actions/ActionBalance';
import {
  saveEmptyTransaction,
  saveExistingTransactions
} from '../actions/ActionTransactionHistory';
import { addPendingTransaction, updateTransactionState } from '../actions/ActionTransactionHistory';
import Web3 from 'web3';

firebase.messaging().onMessage(downstreamMessage => {
  const stateTree = store.getState();
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  if (downstreamMessage.data.type === 'balance') {
    if (downstreamMessage.data.hasOwnProperty('eth')) {
      const ethBalanceInWei = parseInt(downstreamMessage.data.eth, 16);
      const balanceInEther = Web3.utils.fromWei(ethBalanceInWei.toString());
      const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
      store.dispatch(saveEthBalance(roundedBalanceInEther));
    }
    if (downstreamMessage.data.hasOwnProperty('ame_ropsten')) {
      const daiBalance = parseInt(downstreamMessage.data.ame_ropsten, 16) / 10 ** 18;
      store.dispatch(saveDaiBalance(daiBalance));
    }
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count != '0') {
    const transactions = JSON.parse(downstreamMessage.data.items);
    store.dispatch(saveExistingTransactions(transactions));
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count === '0') {
    store.dispatch(saveEmptyTransaction(downstreamMessage.data.items));
  } else if (
    downstreamMessage.data.type === 'txstate' &&
    downstreamMessage.data.state === 'pending'
  ) {
    store.dispatch(addPendingTransaction(downstreamMessage.data));
  } else if (
    downstreamMessage.data.type === 'txstate' &&
    downstreamMessage.data.state === 'included'
  ) {
    if (Array.isArray(transactionsHistory)) {
      transactionsHistory.map(transaction => {
        if (transaction.hash === downstreamMessage.data.txhash) {
          store.dispatch(updateTransactionState(downstreamMessage.data));
        }
      });
    } else if (transactionsHistory === null) {
      console.log('transactions are null');
    }
  } else if (
    downstreamMessage.data.type === 'txstate' &&
    downstreamMessage.data.state === 'confirmed'
  ) {
    if (Array.isArray(transactionsHistory)) {
      transactionsHistory.map(transaction => {
        if (transaction.hash === downstreamMessage.data.txhash) {
          store.dispatch(updateTransactionState(downstreamMessage.data));
        }
      });
    } else if (transactionsHistory === null) {
      console.log('transactions are null');
    }
  }
});
