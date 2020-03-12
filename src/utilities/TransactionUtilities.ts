'use strict';
import BigNumber from 'bignumber.js';
import ethTx from 'ethereumjs-tx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import Web3 from 'web3';
import { addSentTransaction } from '../actions/ActionTransactionHistory';
const GlobalConfig = require('../config.json');
import { store } from '../store/store.js';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletUtilities from './WalletUtilities.ts';
import TxStorage from '../lib/tx.js';

class TransactionUtilities {

  parseEthValue(value) {
    if (value == null)
      return null;

    const bigNumberValue = Web3.utils.toBN(value);//.toString();
    const parsedEtherValue = Web3.utils.fromWei(bigNumberValue).toString();
    return parsedEtherValue;
  }

  parseHexDaiValue(value) {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const parsedDaiValue = RoundDownBigNumber(value, 16)
      .div(new BigNumber(10).pow(18))
      .toString();
    return parsedDaiValue;
  }

  parseHexCDaiValue(value) {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });

    const parsedDaiValue = RoundDownBigNumber(value, 16)
      .div(new BigNumber(10).pow(8))
      .toString();
    return parsedDaiValue;
  }

  parseTransactionTime(timestamp) {
    const seconds = Math.floor((Date.now() - (timestamp * 1000)) / 1000);
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
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      if (minutes > 1) return `${minutes} minutes ago`;
      return '1 minute ago';
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      if (hours > 1) return `${hours} hours ago`;
      return '1 hour ago';
    }
    //2 days and no more
    else if (seconds < 172800) {
      const days = Math.floor(seconds / 86400);
      if (days > 1) return `${days} days ago`;
      return '1 day ago';
    }
    const time = new Date(timestamp * 1000);
    return (
      `${time.getDate().toString()} ${months[time.getMonth()]}, ` +
      `\n${time.getFullYear()}`
    );
  }

  decimalPlaces(number) {
    var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }
    return Math.max(
      0,
      (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
    );
  }

  returnTransactionSpeed(chosenSpeed) {
    const stateTree = store.getState();
    const gasPrice = stateTree.ReducerGasPrice.gasPrice;
      if (chosenSpeed === 0) {
      return gasPrice.fast;
    } else if (chosenSpeed === 1) {
      return gasPrice.average;
    } else if (chosenSpeed === 2) {
      return gasPrice.slow;
    } else {
      LogUtilities.logInfo('invalid transaction speed');
    }
  }

  async constructSignedOutgoingTransactionObject(outgoingTransactionObject) {
    outgoingTransactionObject = new ethTx(outgoingTransactionObject.toTransactionDict());
    let privateKey = await WalletUtilities.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    outgoingTransactionObject.sign(privateKey);
    let signedTransaction = outgoingTransactionObject.serialize();
    signedTransaction = `0x${signedTransaction.toString('hex')}`;
    return signedTransaction;
  }

  async sendOutgoingTransactionToServer(outgoingTransactionObject) {
    const messageId = uuidv4();
    const serverAddress = GlobalConfig.FCM_server_address;
    const signedTransaction = await this.constructSignedOutgoingTransactionObject(
      outgoingTransactionObject
    );
    const nonce = outgoingTransactionObject.getNonce();

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        type: 'outgoing_tx',
        nonce: nonce.toString(),
        data: signedTransaction
      });

    firebase.messaging().sendMessage(upstreamMessage);

    await TxStorage.storage.saveTx(outgoingTransactionObject);
  }

  getTransactionFeeEstimateInEther(gasPriceWei, gasLimit) {
    const transactionFeeEstimateWei = parseFloat(gasPriceWei) * gasLimit;
    const transactionFeeEstimateInEther = Web3.utils.fromWei(
      transactionFeeEstimateWei.toString(),
      'Ether'
    );
    return transactionFeeEstimateInEther;
  }

  getTransactionFeeEstimateInUsd(gasPriceWei, gasLimit) {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      this.getTransactionFeeEstimateInEther(gasPriceWei, gasLimit)
    );
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }
}

export default new TransactionUtilities();
