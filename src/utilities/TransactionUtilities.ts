'use strict';
import BigNumber from 'bignumber.js';
import ethTx from 'ethereumjs-tx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import Web3 from 'web3';
import { addSentTransaction } from '../actions/ActionTransactionHistory';
import { store } from '../store/store.js';
import ABIEncoder from '../utilities/AbiUtilities';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletUtilities from './WalletUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class TransactionUtilities {
  parseEthValue(value) {
    if (value == null) return null;

    const bigNumberValue = Web3.utils.toBN(value); //.toString();
    const parsedEtherValue = Web3.utils.fromWei(bigNumberValue).toString();
    return parsedEtherValue;
  }

  parseHexDaiValue(value) {
    const parsedDaiValue = RoundDownBigNumber(value, 16)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);
    return parsedDaiValue;
  }

  parseHexCDaiValue(value) {
    const parsedDaiValue = RoundDownBigNumber(value, 16)
      .div(new RoundDownBigNumber(10).pow(8))
      .toString();
    return parsedDaiValue;
  }

  parseTransactionTime(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
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
      return parseInt(gasPrice[0].value);
    } else if (chosenSpeed === 1) {
      return parseInt(gasPrice[1].value);
    } else if (chosenSpeed === 2) {
      return parseInt(gasPrice[2].value);
    } else {
      LogUtilities.logInfo('invalid transaction speed');
    }
  }

  validateWeiAmountForTransactionFee(gasPriceWei, gasLimit) {
    const stateTree = store.getState();
    const balance = stateTree.ReducerBalance.balance;
    const weiBalance = new BigNumber(balance.wei);
    const transactionFeeLimitInWei = new BigNumber(gasPriceWei).times(gasLimit);

    if (weiBalance.isGreaterThan(transactionFeeLimitInWei)) {
      LogUtilities.logInfo('the wei amount validated!');
      return true;
    }
    LogUtilities.logInfo('wrong wei balance!');
    return false;
  }

  validateDaiAmount(daiAmount) {
    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(daiAmount);
    if (isNumber) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const daiBalance = new BigNumber(balance.dai);
      daiAmount = new BigNumber(10).pow(18).times(daiAmount);

      if (
        daiBalance.isGreaterThanOrEqualTo(daiAmount) &&
        daiAmount.isGreaterThanOrEqualTo(0)
      ) {
        LogUtilities.logInfo('the dai amount validated!');
        return true;
      }
      LogUtilities.logInfo('wrong dai balance!');
      return false;
    } else {
      return false;
    }
  }

  validateTicketAmount(daiAmount) {
    const isInteger = /^[1-9]\d*$/.test(daiAmount);
    if (isInteger) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const daiBalance = new BigNumber(balance.dai);
      daiAmount = new BigNumber(10).pow(18).times(daiAmount);

      if (
        daiBalance.isGreaterThanOrEqualTo(daiAmount) &&
        daiAmount.isGreaterThanOrEqualTo(0)
      ) {
        LogUtilities.logInfo('the dai amount validated!');
        return true;
      }
      LogUtilities.logInfo('wrong dai balance!');
      return false;
    } else {
      return false;
    }
  }

  validateDaiSavingsAmount(daiWithdrawAmount) {
    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(daiWithdrawAmount);
    if (isNumber) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const compoundDaiBalance = new BigNumber(balance.compoundDai);

      daiWithdrawAmount = new BigNumber(10).pow(36).times(daiWithdrawAmount);

      if (
        compoundDaiBalance.isGreaterThanOrEqualTo(daiWithdrawAmount) &&
        daiWithdrawAmount.isGreaterThanOrEqualTo(0)
      ) {
        LogUtilities.logInfo('the dai savings amount validated!');
        return true;
      }
      LogUtilities.logInfo('wrong dai balance!');
      return false;
    } else {
      return false;
    }
  }

  // finish writing this once you get the deposited balance
  validateDaiDepositedAmount(daiWithdrawAmount) {
    const isInteger = /^[1-9]\d*$/.test(daiWithdrawAmount);
    if (isInteger) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;

      daiWithdrawAmount = new BigNumber(10).pow(36).times(daiWithdrawAmount);

      LogUtilities.logInfo('wrong dai balance!');
      return false;
    } else {
      return false;
    }
  }

  async constructSignedOutgoingTransactionObject(outgoingTransactionObject) {
    outgoingTransactionObject = new ethTx(
      outgoingTransactionObject.toTransactionDict()
    );
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
    const transactionFeeEstimateWei = Web3.utils
      .toBN(gasPriceWei)
      .mul(Web3.utils.toBN(gasLimit));
    const transactionFeeEstimateInEther = Web3.utils
      .fromWei(transactionFeeEstimateWei, 'Ether')
      .toString();
    return transactionFeeEstimateInEther;
  }

  getTransactionFeeEstimateInUsd(gasPriceWei, gasLimit) {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      this.getTransactionFeeEstimateInEther(gasPriceWei, gasLimit)
    );
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }

  getApproveEncodedABI(addressSpender) {
    const amount = `0x${'ff'.repeat(256 / 8)}`; // TODO: this needs to be a const somewhere, likely uint256max_hex.

    const approveEncodedABI = ABIEncoder.encodeApprove(
      addressSpender,
      amount,
      0
    );

    return approveEncodedABI;
  }

  async constructApproveTransactionObject(spender, gasChosen) {
    const approveEncodedABI = this.getApproveEncodedABI(spender);
    const approveTransactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAITokenContract)
      .setGasPrice(this.returnTransactionSpeed(gasChosen).toString(16))
      .setGas(GlobalConfig.ERC20ApproveGasLimit.toString(16))
      .tempSetData(approveEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval, [
        (spender.startsWith('0x') ? spender.substr(2) : spender).toLowerCase(),
        TxStorage.storage.getOwnAddress(),
        'ff'.repeat(256 / 8)
      ]);

    return approveTransactionObject;
  }

}

export default new TransactionUtilities();
