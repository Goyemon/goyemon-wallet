import firebase from 'react-native-firebase';
import { store } from '../store/store';
import { saveEthBalance } from '../actions/ActionBalance';
import {
  saveEmptyTransaction,
  saveExistingTransactions
} from '../actions/ActionTransactionHistory';
import { addPendingTransaction, updateTransactionState } from '../actions/ActionTransactionHistory';
import Web3 from 'web3';

firebase.messaging().onMessage(downstreamMessage => {
  let stateTree = store.getState();
  let transactionsHistory = stateTree.ReducerTransactionHistory.transactions;
  if (downstreamMessage.data.type === 'balance') {
    const balanceInWei = downstreamMessage.data.balance;
    const balanceInEther = Web3.utils.fromWei(balanceInWei);
    const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
    store.dispatch(saveEthBalance(roundedBalanceInEther));
  } else if (downstreamMessage.data.type === 'daiBalance') {
    store.dispatch(saveDaiBalance(downstreamMessage.data.daiBalance));
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
