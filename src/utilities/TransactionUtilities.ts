'use strict';
import ProviderUtilities from './ProviderUtilities.ts';
import { store } from '../store/store.js';
import Web3 from 'web3';

class TransactionUtilities {

  parseExistingTransactions(transactions) {
    const parsedTransactions = transactions.map(transaction => {
      return {
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        value: this.parseTransactionValue(transaction.value),
        time: transaction.time,
        nonce: parseInt(transaction.nonce),
        state: 'confirmed',
        ame_ropsten: transaction.ame_ropsten
      };
    });
    return parsedTransactions;
  }

  parsePendingTransaction(transactionObject) {
    let parsedTransaction;
    if (transactionObject.ame_ropsten != undefined) {
      parsedTransaction = {
        hash: transactionObject.txhash,
        from: transactionObject.txfrom,
        to: transactionObject.txto,
        gasLimit: transactionObject.gas,
        gasPrice: transactionObject.gasPrice,
        value: this.parseTransactionValue(transactionObject.value),
        time: transactionObject.timestamp,
        nonce: transactionObject.nonce,
        state: transactionObject.state,
        ame_ropsten: JSON.parse(transactionObject.ame_ropsten)
      };
    }
    parsedTransaction = {
      hash: transactionObject.txhash,
      from: transactionObject.txfrom,
      to: transactionObject.txto,
      gasLimit: transactionObject.gas,
      gasPrice: transactionObject.gasPrice,
      value: this.parseTransactionValue(transactionObject.value),
      time: transactionObject.timestamp,
      nonce: transactionObject.nonce,
      state: transactionObject.state
    };
    return parsedTransaction;
  }

  parseTransactionValue(value) {
    const bigNumberValue = Web3.utils.toBN(value).toString();
    const parsedEtherValue = Web3.utils.fromWei(bigNumberValue);
    return parsedEtherValue;
  }

  parseTransactionTime(timestamp) {
    const time = new Date(timestamp * 1000);
    const seconds = Math.floor((new Date() - time) / 1000);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    if (seconds < 5) {
      return 'just now';
    } else if (seconds < 60) {
      return seconds + ' seconds ago';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      if (minutes > 1) return minutes + ' minutes ago';
      else return '1 minute ago';
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      if (hours > 1) return hours + ' hours ago';
      else return '1 hour ago';
    }
    //2 days and no more
    else if (seconds < 172800) {
      const days = Math.floor(seconds / 86400);
      if (days > 1) return days + ' days ago';
      else return '1 day ago';
    } else {
      return (
        time.getDate().toString() + ' ' + months[time.getMonth()] + ', ' + '\n' + time.getFullYear()
      );
    }
  }

  getBiggestNonce() {
    const stateTree = store.getState();
    const transactions = stateTree.ReducerTransactionHistory.transactions;
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

    const array = [];
    transactions.map(transaction => {
      if (
        Web3.utils.toChecksumAddress(transaction.from) === checksumAddress
      ) {
        array.push(transaction.nonce);
      }
    });
    let biggestNonce = 0;
    for (let i = 0; i <= biggestNonce; i++) {
      if (array[i] > biggestNonce) {
        biggestNonce = array[i];
      }
    }

    return biggestNonce;
  }
}

export default new TransactionUtilities();
