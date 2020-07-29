'use strict';
import ethTx from 'ethereumjs-tx';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import uuidv4 from 'uuid/v4';
import Web3 from 'web3';
import { store } from '../store/store.js';
import ABIEncoder from '../utilities/AbiUtilities';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from '../utilities/BigNumberUtilities';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletUtilities from './WalletUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';
import EtherUtilities from './EtherUtilities';
import StyleUtilities from './StyleUtilities';

class TransactionUtilities {
  parseETHValue(value) {
    if (value == null) return null;

    const bigNumberValue = Web3.utils.toBN(value); //.toString();
    const parsedEtherValue = Web3.utils.fromWei(bigNumberValue).toString();
    return parsedEtherValue;
  }

  parseHexDAIValue(value) {
    const parsedDAIValue = RoundDownBigNumberPlacesFour(value, 16)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(2);
    return parsedDAIValue;
  }

  parseHexCDAIValue(value) {
    const parsedCDAIValue = RoundDownBigNumberPlacesFour(value, 16)
      .div(new RoundDownBigNumberPlacesFour(10).pow(8))
      .toString();
    return parsedCDAIValue;
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

  // retrieve the number of decimals
  decimalPlaces(number) {
    const match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
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

  hasSufficientWEIForNetworkFee(gasPriceWei, gasLimit) {
    const stateTree = store.getState();
    const balance = stateTree.ReducerBalance.balance;
    const WEIBalance = new RoundDownBigNumberPlacesEighteen(balance.wei);
    const maxNetworkFeeInWEI = new RoundDownBigNumberPlacesEighteen(
      gasPriceWei
    ).times(gasLimit);

    if (WEIBalance.isGreaterThan(maxNetworkFeeInWEI)) {
      LogUtilities.logInfo('the wei amount validated!');
      return true;
    }
    LogUtilities.logInfo('wrong wei balance!');
    return false;
  }

  hasSufficientWeiForAmount(WEIAmount, gasLimit) {
    LogUtilities.logInfo('hasSufficientWeiForAmount -> ', WEIAmount, gasLimit);

    if (this.isNumber(WEIAmount)) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const gasChosen = stateTree.ReducerGasPrice.gasChosen;
      const WEIBalance = new RoundDownBigNumberPlacesEighteen(balance.wei);
      WEIAmount = new RoundDownBigNumberPlacesEighteen(WEIAmount);
      const maxNetworkFeeInWEI = new RoundDownBigNumberPlacesEighteen(
        this.returnTransactionSpeed(gasChosen)
      ).times(gasLimit);

      if (
        WEIBalance.isGreaterThanOrEqualTo(WEIAmount.plus(maxNetworkFeeInWEI)) &&
        WEIAmount.isGreaterThanOrEqualTo(0)
      ) {
        return true;
      }
      LogUtilities.logInfo('wrong balance!');
      return false;
    } else {
      return false;
    }
  }

  hasSufficientDAIForAmount(DAIAmount) {
    if (this.isNumber(DAIAmount) && this.isLessThan18Digits(DAIAmount)) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const DAIBalance = new RoundDownBigNumberPlacesEighteen(balance.dai);
      DAIAmount = new RoundDownBigNumberPlacesEighteen(10)
        .pow(18)
        .times(DAIAmount);

      if (
        DAIBalance.isGreaterThanOrEqualTo(DAIAmount) &&
        DAIAmount.isGreaterThanOrEqualTo(0)
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

  hasSufficientTokenForAmount = (amount, token) => {
    if (this.isNumber(amount)) {
      const stateTree = store.getState();
      const balanceState = stateTree.ReducerBalance.balance;
      const balanceObject = {
        DAI: balanceState.dai,
        cDAI: balanceState.cDai,
        plDAI: balanceState.pooltogetherDai.committed
      };
      const tokenBalance = new RoundDownBigNumberPlacesEighteen(
        balanceObject[token]
      );
      const tokenAmount = new RoundDownBigNumberPlacesEighteen(10)
        .pow(token === 'cDAI' ? 8 : 18)
        .times(amount);
      if (
        tokenBalance.isGreaterThanOrEqualTo(tokenAmount) &&
        tokenAmount.isGreaterThanOrEqualTo(0)
      ) {
        LogUtilities.logInfo('the dai amount validated!');
        return true;
      }
    }
    LogUtilities.logInfo('wrong dai balance!');
    return false;
  };

  hasSufficientDAIForPoolTogetherDepositAmount(DAIAmount) {
    if (this.isInteger(DAIAmount) && this.isLessThan18Digits(DAIAmount)) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const DAIBalance = new RoundDownBigNumberPlacesEighteen(balance.dai);
      DAIAmount = new RoundDownBigNumberPlacesEighteen(10)
        .pow(18)
        .times(DAIAmount);

      if (
        DAIBalance.isGreaterThanOrEqualTo(DAIAmount) &&
        DAIAmount.isGreaterThanOrEqualTo(0)
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

  validateDAICompoundWithdrawAmount(DAIWithdrawAmount) {
    if (
      this.isNumber(DAIWithdrawAmount) &&
      this.isLessThan18Digits(DAIWithdrawAmount)
    ) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const compoundDAIBalance = new RoundDownBigNumberPlacesEighteen(
        balance.compoundDai
      );

      DAIWithdrawAmount = new RoundDownBigNumberPlacesEighteen(10)
        .pow(36)
        .times(DAIWithdrawAmount);

      if (
        compoundDAIBalance.isGreaterThanOrEqualTo(DAIWithdrawAmount) &&
        DAIWithdrawAmount.isGreaterThanOrEqualTo(0)
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

  validateDAIPoolTogetherWithdrawAmount(DAIWithdrawAmount) {
    if (
      this.isInteger(DAIWithdrawAmount) &&
      this.isLessThan18Digits(DAIWithdrawAmount)
    ) {
      const stateTree = store.getState();
      const balance = stateTree.ReducerBalance.balance;
      const pooltogetherDAIBalance = RoundDownBigNumberPlacesFour(
        balance.pooltogetherDai.open
      )
        .plus(balance.pooltogetherDai.committed)
        .plus(balance.pooltogetherDai.sponsored);

      DAIWithdrawAmount = new RoundDownBigNumberPlacesEighteen(10)
        .pow(18)
        .times(DAIWithdrawAmount);

      if (
        pooltogetherDAIBalance.isGreaterThanOrEqualTo(DAIWithdrawAmount) &&
        DAIWithdrawAmount.isGreaterThanOrEqualTo(0)
      ) {
        LogUtilities.logInfo('the DAI withdraw amount validated!');
        return true;
      }

      LogUtilities.logInfo('wrong DAI balance!');
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
    // should be renamed cause it also does .saveTx()
    await this.sendTransactionToServer(outgoingTransactionObject);
    await TxStorage.storage.saveTx(outgoingTransactionObject);
  }

  async sendTransactionToServer(txObject) {
    // should be renamed cause it also does .saveTx()
    const messageId = uuidv4();
    const serverAddress = GlobalConfig.FCM_server_address;
    const signedTransaction = await this.constructSignedOutgoingTransactionObject(
      txObject
    );
    const nonce = txObject.getNonce();

    const upstreamMessage = {
      messageId: messageId,
      to: serverAddress,
      data: {
        type: 'outgoing_tx',
        nonce: nonce.toString(),
        data: signedTransaction
      }
    };

    firebase
      .messaging()
      .sendMessage(upstreamMessage)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  getMaxNetworkFeeInETH(gasPriceWei, gasLimit) {
    const maxNetworkFeeInWei = Web3.utils
      .toBN(gasPriceWei)
      .mul(Web3.utils.toBN(gasLimit));
    const maxNetworkFeeInEther = Web3.utils
      .fromWei(maxNetworkFeeInWei)
      .toString();
    return maxNetworkFeeInEther;
  }

  getMaxNetworkFeeInUSD(gasPriceWei, gasLimit) {
    let maxNetworkFeeInUSD = PriceUtilities.convertETHToUSD(
      this.getMaxNetworkFeeInETH(gasPriceWei, gasLimit)
    );
    maxNetworkFeeInUSD = maxNetworkFeeInUSD.toFixed(3);
    return maxNetworkFeeInUSD;
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

  ETHToHexWEI(etherValue) {
    const weiValue = Web3.utils.toWei(etherValue);
    return new RoundDownBigNumberPlacesEighteen(weiValue).toString(16);
  }

  constructETHTransfer = async (toAddr, amount, gasChosen, gasLimit) =>
    (await TxStorage.storage.newTx())
      .setTo(toAddr)
      .setValue(new RoundDownBigNumberPlacesEighteen(amount).toString(16))
      .setGasPrice(this.returnTransactionSpeed(gasChosen).toString(16))
      .setGas(gasLimit.toString(16));

  constructDAITransfer = async (toAddr, amount, gasChosen, gasLimit) => {
    const DAIAmount = amount.split('.').join('');
    const decimalPlaces = this.decimalPlaces(amount);
    const decimals = 18 - decimalPlaces;
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      toAddr,
      DAIAmount,
      decimals
    );
    const DAIAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(amount)
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    return (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAITokenContract)
      .setGasPrice(this.returnTransactionSpeed(gasChosen).toString(16))
      .setGas(gasLimit.toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.transfer, [
        TxStorage.storage.getOwnAddress(),
        toAddr,
        DAIAmountWithDecimals
      ]);
  };

  constructCDAITransfer = async (toAddr, amount, gasChosen, gasLimit) => {
    const CDAIAmount = amount.split('.').join('');
    const decimalPlaces = this.decimalPlaces(amount);
    const decimals = 8 - decimalPlaces;
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      toAddr,
      CDAIAmount,
      decimals
    );
    const CDAIAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(amount)
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(8))
      .toString(16);

    return (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(this.returnTransactionSpeed(gasChosen).toString(16))
      .setGas(gasLimit.toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.transfer, [
        TxStorage.storage.getOwnAddress(),
        toAddr,
        CDAIAmountWithDecimals
      ]);
  };

  constructPLDAITransfer = async (toAddr, amount, gasChosen, gasLimit) => {
    const PLDAIAmount = amount.split('.').join('');
    const decimalPlaces = this.decimalPlaces(amount);
    const decimals = 18 - decimalPlaces;
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      toAddr,
      PLDAIAmount,
      decimals
    );
    const PLDAIAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(amount)
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    return (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIPoolTogetherTokenContractV2)
      .setGasPrice(this.returnTransactionSpeed(gasChosen).toString(16))
      .setGas(gasLimit.toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('pldai', TxStorage.TxTokenOpTypeToName.transfer, [
        TxStorage.storage.getOwnAddress(),
        toAddr,
        PLDAIAmountWithDecimals
      ]);
  };

  prefixUpperCase = (txType) =>
    txType.charAt(0).toUpperCase() + txType.slice(1);

  computeTxData = (tx, checksumAddr) => {
    // LogUtilities.toDebugScreen('computeTxData -> ', tx);
    if (!tx) return null;
    const walletAddressWithout0x = EtherUtilities.getAddressWithout0x(
      checksumAddr
    );
    const ret = [];

    Object.entries(tx.getAllTokenOperations()).forEach(([toptok, toktops]) => {
      toktops.forEach((x) => {
        // LogUtilities.toDebugScreen('toktops for each', x);
        ret.push(EtherUtilities.topType(x, toptok, walletAddressWithout0x));
      });
    });

    if (tx.getValue() !== '00' && ret.length === 0) {
      const direction =
        tx.getFrom() === tx.getTo()
          ? 'self'
          : tx.getFrom() === `0x${walletAddressWithout0x}`
          ? 'outgoing'
          : tx.getTo() === `0x${walletAddressWithout0x}`
          ? 'incoming'
          : undefined;

      if (direction)
        ret.push({
          type: 'transfer',
          direction: direction,
          amount: parseFloat(this.parseETHValue(`0x${tx.getValue()}`)).toFixed(
            4
          ),
          token: 'eth'
        });
    }

    if (tx.getTo() !== '0x' && !!tx.getTo()) {
      if (
        tx.getTo().toLowerCase() ===
          GlobalConfig.DAIPoolTogetherContractV2.toLowerCase() &&
        ret.length === 0
      )
        ret.push({
          type: 'outgoing',
          token: 'dai',
          direction: 'outgoing',
          amount: '0.00'
        });
      else if (
        tx.getTo().toLowerCase() ===
          GlobalConfig.DAIPoolTogetherTokenContractV2.toLowerCase() &&
        ret.length === 0
      )
        ret.push({
          type: 'outgoing',
          token: 'pldai',
          direction: 'outgoing',
          amount: '0.00'
        });
    } else
      ret.push({
        type: 'contract_creation',
        direction: 'creation',
        token: 'eth'
      });

    if (ret.length === 0)
      ret.push({
        type: 'contract_interaction',
        direction: 'outgoing',
        token: 'eth',
        amount: '0.00'
      });

    return ret;
  };

  setIconStyle = (type, direction) =>
    StyleUtilities.inOrOutIcon(type, direction);

  getIcon(txData, service) {
    switch (service) {
      case 'PoolTogether':
        if (txData.length === 3)
          for (const element of txData)
            if (element.type == 'committed deposit withdraw')
              return this.setIconStyle(txData[0].type, txData[0].direction);
      case 'Uniswap':
        if (txData.length == 2 && txData[1].type == 'swap')
          return this.setIconStyle(txData[1].type, txData[1].direction);
      case 'Contract Creation':
        return this.setIconStyle(txData[0].type, txData[0].direction);
      case 'Compound':
      case '':
      default:
        return this.setIconStyle(txData[0].type, txData[0].direction);
    }
  }

  getOption = (data, service, method) => {
    // LogUtilities.toDebugScreen('getOption data is', data)
    if (service === 'Uniswap' || method === I18n.t('history-swap'))
      return data.length < 1 ? false : this.getSwapOption(data);
    else if (service === 'PoolTogether' && method === 'Withdraw') {
      return this.getPTOption(data);
    } else return '';
  };

  getSwapOption = (data) => ({
    eth: data[0].eth_sold,
    dai: data[0].tokens_bought
  });

  getPTOption = (data) => {
    const open = this.poolTogetherAmount(data, 'open deposit withdraw');
    const committed = this.poolTogetherAmount(
      data,
      'committed deposit withdraw'
    );
    const sponsor = this.poolTogetherAmount(data, 'sponsorship withdraw');
    return {
      open,
      committed,
      sponsor,
      sum: (
        parseFloat(open) +
        parseFloat(committed) +
        parseFloat(sponsor)
      ).toFixed(2)
    };
  };

  poolTogetherAmount(txData, type) {
    for (const element of txData)
      if (element.type === type) return element.amount;
    return '0.00';
  }

  getToken = (data) => {
    // LogUtilities.toDebugScreen('getToken data is', data)
    switch (true) {
      case data[0].token === 'cdai' && data[0].type === 'withdraw':
        return 'DAI';
      case data[0].token === 'cdai' && data[0].type === 'deposit':
        return 'DAI';
      case data[0].token === 'cdai' && data[0].type === 'transfer':
        return 'cDAI';
      case data[0].token === 'pooltogether' && data[0].type === 'withdraw':
        return 'DAI';
      case data[0].token === 'pldai' && data[0].type === 'transfer':
        return 'plDAI';
      default:
        return data[0].token.toUpperCase();
    }
  };

  getMethodName = (tx) => {
    // LogUtilities.toDebugScreen('getMethodName -> ', tx);
    switch (tx[0].type) {
      case 'contract_creation':
        return 'Deploy';
      case 'multicontract':
        return 'Multi';
      case 'approval':
        return I18n.t('history-approve');
      case 'deposit':
        return I18n.t('deposit');
      case 'withdraw':
        return I18n.t('withdraw');
      case 'rewarded':
        return 'Reward';
      case 'swap':
        return I18n.t('history-swap');
      case 'transfer':
        if (tx.length > 1 && tx[1].type === 'swap')
          return I18n.t('history-swap');
        else
          return tx[0].direction === 'self'
            ? 'Self'
            : tx[0].direction === 'outgoing'
            ? I18n.t('history-outgoing')
            : I18n.t('history-incoming');
      case 'outgoing':
        return I18n.t('history-outgoing');
      case 'sponsorship withdraw':
      case 'committed deposit withdraw':
      case 'open deposit withdraw':
        return I18n.t('withdraw');
      case 'contract_interaction':
        return 'Contract Interaction';
      case 'failure':
        return I18n.t('history-failed');
      default:
        return 'Contract Interaction';
    }
  };

  getFromAddr = (data, tx) =>
    data.length === 1 &&
    data[0].direction == 'incoming' &&
    data[0].type == 'transfer'
      ? tx.getFrom()
      : '';

  getToAddr = (data, tx) => {
    // LogUtilities.toDebugScreen('getToAddr -> ', data, tx);
    if (
      data.length === 1 &&
      data[0].direction == 'outgoing' &&
      data[0].type == 'transfer'
    ) {
      if (data[0].token === 'eth') return tx.getTo();
      if (tx.tokenData.dai)
        return tx.tokenData.dai[0].to_addr.slice(0, 2) !== '0x'
          ? '0x' + tx.tokenData.dai[0].to_addr
          : tx.tokenData.dai[0].to_addr;
      if (tx.tokenData.cdai)
        return '0x' + tx.tokenData.cdai[0].to_addr.slice(0, 2) !== '0x'
          ? '0x' + tx.tokenData.cdai[0].to_addr
          : tx.tokenData.cdai[0].to_addr;
      if (tx.tokenData.pldai)
        return '0x' + tx.tokenData.pldai[0].to_addr.slice(0, 2) !== '0x'
          ? '0x' + tx.tokenData.pldai[0].to_addr
          : tx.tokenData.pldai[0].to_addr;
    } else return '';
  };

  txCommonObject = (tx, checksumAddr) => {
    const timestamp = this.parseTransactionTime(tx.getTimestamp()),
      status = tx.getState(),
      data = this.computeTxData(tx, checksumAddr),
      service =
        data[0].type === 'transfer' ? '' : tx.getApplication(tx.getTo()),
      method = this.getMethodName(data),
      amount =
        tx.tokenData.cdai &&
        data[0].type === 'transfer' &&
        data[0].direction !== 'self'
          ? this.parseHexCDAIValue(tx.tokenData.cdai[0].amount)
          : data[0].amount,
      token = this.getToken(data),
      inOrOut = StyleUtilities.minusOrPlusIcon(data[0].type, data[0].direction),
      icon = this.getIcon(data, service),
      option = this.getOption(data, service, method);
    return {
      timestamp,
      status,
      service,
      method,
      amount,
      token,
      icon,
      inOrOut,
      option
    };
  };

  txDetailObject = (tx, checksumAddr) => {
    const {
      timestamp,
      status,
      service,
      method,
      amount,
      token,
      icon,
      inOrOut,
      option
    } = this.txCommonObject(tx, checksumAddr);
    const networkFee =
        (parseInt(tx.getGasPrice(), 16) * parseInt(tx.gas, 16)) /
        1000000000000000000,
      hash = tx.getHash(),
      data = this.computeTxData(tx, checksumAddr),
      from = data[0].direction ? this.getFromAddr(data, tx) : '',
      to = data[0].direction ? this.getToAddr(data, tx) : '';

    return {
      timestamp,
      status,
      service,
      method,
      amount,
      token,
      networkFee,
      hash,
      from,
      to,
      inOrOut,
      icon,
      option
    };
  };

  isNumber = (value) => /^[0-9]\d*(\.\d+)?$/.test(value);

  isInteger = (number) => /^[1-9]\d*$/.test(number);

  isLessThan18Digits = (amount) =>
    String(amount).slice(0, 2) === '0.'
      ? amount.length < 21
      : amount.length < 19;
}

export default new TransactionUtilities();
