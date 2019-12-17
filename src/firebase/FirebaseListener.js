'use strict';
import firebase from 'react-native-firebase';
import { store } from '../store/store';
import { saveEthBalance, saveDaiBalance } from '../actions/ActionBalance';
import { saveTransactionCount } from '../actions/ActionTransactionCount';
import {
  saveEmptyTransaction,
  saveExistingTransactions
} from '../actions/ActionTransactionHistory';
import {
  addPendingOrIncludedTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import Web3 from 'web3';
import EtherUtilities from '../utilities/EtherUtilities.js';

const firebaseListener = async () => {
  firebase.messaging().onMessage(downstreamMessage => {
    console.log('downstreamMessage ===>', downstreamMessage);
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
        let daiBalance = parseInt(downstreamMessage.data.ame_ropsten, 16) / 10 ** 18;
        daiBalance = daiBalance.toFixed(2);
        store.dispatch(saveDaiBalance(daiBalance));
      }
    } else if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count != '0') {
      const transactions = JSON.parse(downstreamMessage.data.items);
      store.dispatch(saveExistingTransactions(transactions));
      store.dispatch(saveTransactionCount(downstreamMessage.data.count));
    } else if (
      downstreamMessage.data.type === 'txhistory' &&
      downstreamMessage.data.count === '0'
    ) {
      store.dispatch(saveEmptyTransaction(downstreamMessage.data.items));
      store.dispatch(saveTransactionCount(downstreamMessage.data.count));
    } else if (downstreamMessage.data.type === 'txstate') {
      if (Array.isArray(transactionsHistory)) {
        transactionsHistory.map(transaction => {
          if (downstreamMessage.data.state === 'pending') {
            if (
              downstreamMessage.data.hasOwnProperty('txfrom') &&
              downstreamMessage.data.hasOwnProperty('nonce')
            ) {
              if (
                transaction.from ===
                  Web3.utils.toChecksumAddress(
                    EtherUtilities.stripHexPrefix(downstreamMessage.data.txfrom)
                  ) &&
                transaction.nonce === parseInt(downstreamMessage.data.nonce, 16) &&
                transaction.state === 'sent' &&
                !(transaction.state === 'included') &&
                !(transaction.state === 'confirmed')
              ) {
                store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              }
            }
          } else if (downstreamMessage.data.state === 'included') {
            if (
              downstreamMessage.data.hasOwnProperty('txfrom') &&
              downstreamMessage.data.hasOwnProperty('nonce')
            ) {
              if (
                transaction.from ===
                  Web3.utils.toChecksumAddress(
                    EtherUtilities.stripHexPrefix(downstreamMessage.data.txfrom)
                  ) &&
                transaction.nonce === parseInt(downstreamMessage.data.nonce, 16) &&
                transaction.state === 'sent' &&
                !(transaction.state === 'confirmed')
              ) {
                store.dispatch(addPendingOrIncludedTransaction(downstreamMessage.data));
              }
            }
            if (transaction.hash === downstreamMessage.data.txhash) {
              store.dispatch(updateTransactionState(downstreamMessage.data));
            }
          } else if (downstreamMessage.data.state === 'confirmed') {
            if (transaction.hash === downstreamMessage.data.txhash) {
              store.dispatch(updateTransactionState(downstreamMessage.data));
            }
          }
        });
      } else if (transactionsHistory === null) {
        console.log('transactions are null');
      }
    }
  });

  return Promise.resolve();
};

firebaseListener();

export default firebaseListener;
