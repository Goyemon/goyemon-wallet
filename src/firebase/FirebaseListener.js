import firebase from 'react-native-firebase';
import { store } from '../store/store';
import { saveWeb3 } from '../actions/ActionWeb3';
import { saveEthBalance } from '../actions/ActionBalance';
import {
  saveEmptyTransaction,
  saveExistingTransactions
} from '../actions/ActionTransactionHistory';

store.dispatch(saveWeb3());

const stateTree = store.getState();
const web3 = stateTree.ReducerWeb3.web3;

firebase.messaging().onMessage(downstreamMessage => {
  if (downstreamMessage.data.type === 'balance') {
    const balanceInWei = downstreamMessage.data.balance;
    const balanceInEther = web3.utils.fromWei(balanceInWei);
    const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
    store.dispatch(saveEthBalance(roundedBalanceInEther));
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count != '0') {
    const transactions = JSON.parse(downstreamMessage.data.items);
    store.dispatch(saveExistingTransactions(transactions));
  } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count === '0') {
    store.dispatch(saveEmptyTransaction(downstreamMessage.data.items));
  }
});
