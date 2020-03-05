'use strict';
import BigNumber from 'bignumber.js';
import firebase from 'react-native-firebase';
import Web3 from 'web3';
import {
  saveCDaiBalance,
  saveDaiBalance,
  saveDaiSavingsBalance,
  saveWeiBalance
} from '../actions/ActionBalance';
import {
  saveCDaiLendingInfo,
  saveDaiApprovalInfo
} from '../actions/ActionCDaiLendingInfo';
import {
  saveTotalTransactions,
  incrementTotalTransactions
} from '../actions/ActionTotalTransactions';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updateWithPendingOrIncludedTransaction,
  updateTransactionState,
  addConfirmedTransaction,
  updateConfirmedTransactionData,
  removeExistingTransactionObject,
  updateErrorSentTransaction
} from '../actions/ActionTransactionHistory';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import FcmMsgsParser from './FcmMsgsParser.js';
import { store } from '../store/store';
import { saveOtherDebugInfo } from '../actions/ActionDebugInfo.js';

import TxStorage from '../lib/tx.js';

async function downstreamMessageHandler(downstreamMessage) {
  const stateTree = store.getState();
  const balance = stateTree.ReducerBalance.balance;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

  LogUtilities.logInfo('downstreamMessage ===>', downstreamMessage);

  if (downstreamMessage.data.type === 'balance') {
    const balanceMessage = JSON.parse(downstreamMessage.data.data);
    if (balanceMessage.hasOwnProperty('eth')) {
      let weiBalance = new BigNumber(balanceMessage.eth);
      weiBalance = weiBalance.toString(10);
      store.dispatch(saveWeiBalance(weiBalance));
    }
    if (balanceMessage.hasOwnProperty('dai')) {
      let daiBalance = new BigNumber(balanceMessage.dai);
      daiBalance = daiBalance.toString(10);
      store.dispatch(saveDaiBalance(daiBalance));
    }
    if (balanceMessage.hasOwnProperty('cdai')) {
      setTimeout(() => {
        FcmUpstreamMsgs.requestCDaiLendingInfo(checksumAddress);
      }, 15000);

      let cDaiBalance = new BigNumber(balanceMessage.cdai);
      cDaiBalance = cDaiBalance.toString(10);
      store.dispatch(saveCDaiBalance(cDaiBalance));
    }

  } else if (downstreamMessage.data.type === 'txhistory') {
    if (downstreamMessage.data.data === '{}') {
      store.dispatch(saveOtherDebugInfo('got empty txhistory'));
      store.dispatch(saveEmptyTransaction(downstreamMessage.data.data));
      store.dispatch(saveTotalTransactions(0));
      await TxStorage.storage.clear();
      return;
    }

    FcmMsgsParser.fcmMsgsSaver(downstreamMessage.data);
    const stateTree = store.getState();
    const fcmMsgs = stateTree.ReducerFcmMsgs.fcmMsgs;
    if (fcmMsgs[downstreamMessage.data.uid] != undefined) {
      if (
        fcmMsgs[downstreamMessage.data.uid].length ===
        parseInt(downstreamMessage.data.count)
      ) {
        const transactions = FcmMsgsParser.fcmMsgsToTransactions(
          downstreamMessage.data
        );

        // TODO: remove this temp cleanup:
        store.dispatch(saveEmptyTransaction('{}'));
        store.dispatch(saveTotalTransactions(0));

        try {
          TxStorage.storage.setOwnAddress(checksumAddress);
          await TxStorage.storage.clear();
          await TxStorage.storage.parseTxHistory(transactions);
        }
        catch (e) {
          store.dispatch(saveOtherDebugInfo(`exception: ${e.message} @ ${e.stack}`));
        }
      }
    }

  } else if (downstreamMessage.data.type === 'txstate') {
    // TODO: this doesnt support msgs batches spread across multiple fcm messages yet.
    const txStateMessages = JSON.parse(downstreamMessage.data.data);
    await Promise.all(Object.entries(txStateMessages).map(([hash, data]) => TxStorage.storage.processTxState(hash, data)));

  } else if (downstreamMessage.data.type === 'cDai_lending_info') {
    const cDaiLendingInfoMessage = JSON.parse(downstreamMessage.data.data);
    store.dispatch(saveCDaiLendingInfo(cDaiLendingInfoMessage));
    store.dispatch(
      saveDaiSavingsBalance(
        balance.cDaiBalance,
        cDaiLendingInfoMessage.current_exchange_rate
      )
    );
  } else if (downstreamMessage.data.type === 'transactionError') {
    const errorMessage = JSON.parse(downstreamMessage.data.error);
    if (errorMessage.message === 'nonce too low') { // why only this if that transaction is guaranteed not to be propagated?
      TxStorage.storage.markSentTxAsErrorByNonce(parseInt(downstreamMessage.data.nonce));
    }
  }
}

function registerHandler() {
  firebase.messaging().onMessage(downstreamMessageHandler);
}

module.exports = {
  registerHandler: registerHandler,
  downstreamMessageHandler: downstreamMessageHandler
}
