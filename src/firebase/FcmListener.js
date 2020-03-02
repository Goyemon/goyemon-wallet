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

firebase.messaging().onMessage(async downstreamMessage => {
  const stateTree = store.getState();
  const balance = stateTree.ReducerBalance.balance;
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
  const transactionsHistory = stateTree.ReducerTransactionHistory.transactions;

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
      TxStorage.storage.clear();
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
        const parsedExistingTxes = TransactionUtilities.parseExistingTransactions(
          transactions
        );
        store.dispatch(saveExistingTransactions(parsedExistingTxes));
        store.dispatch(saveTotalTransactions(parsedExistingTxes.length));
        store.dispatch(
          saveDaiApprovalInfo(
            TransactionUtilities.isDaiApproved(parsedExistingTxes)
          )
        );
        try {
          TxStorage.storage.setOwnAddress(checksumAddress);
          await TxStorage.storage.clear()
          store.dispatch(saveOtherDebugInfo('listener TxStorage parse'));
          await TxStorage.storage.parseTxHistory(transactions);
          store.dispatch(saveOtherDebugInfo('listener TxStorage end parse'));
        }
        catch (e) {
          store.dispatch(saveOtherDebugInfo(`exception: ${e.message} @ ${e.stack}`));
        }
      }
    }
  } else if (downstreamMessage.data.type === 'txstate') {
    // TODO: this doesnt support msgs batches spread across multiple fcm messages yet.
    let txStateMessages = JSON.parse(downstreamMessage.data.data);
    await Promise.all(Object.entries(txStateMessages).map(([hash, data]) => TxStorage.storage.processTxState(hash, data)));

    txStateMessages = Object.entries(txStateMessages).map(e => ({
      [e[0]]: e[1]
    }));
    txStateMessages.map(txStateMessage => {
      const isPendingState =
        txStateMessage[Object.keys(txStateMessage)[0]][7] === 1;
      const isIncludedState =
        txStateMessage[Object.keys(txStateMessage)[0]][7] === 2;
      const isConfirmedState =
        txStateMessage[Object.keys(txStateMessage)[0]][7] === 3;

      const transactionsExist = Array.isArray(transactionsHistory);

      if (isPendingState || isIncludedState) {
        const parsedPendingOrIncludedTx = TransactionUtilities.parsePendingOrIncludedTransaction(
          txStateMessage
        );

        let sentTxExist;
        let pendingTxExist;
        let includedTxExist;
        let confirmedTxExist;
        if (transactionsExist) {
          sentTxExist = transactionsHistory.some(
            transaction =>
              transaction.nonce === parsedPendingOrIncludedTx.nonce &&
              transaction.state === 'sent'
          );
          pendingTxExist = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedPendingOrIncludedTx.hash &&
              transaction.state === 'pending'
          );
          includedTxExist = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedPendingOrIncludedTx.hash &&
              transaction.state === 'included'
          );
          confirmedTxExist = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedPendingOrIncludedTx.hash &&
              transaction.state === 'confirmed'
          );
        }

        const isIncomingEthTx =
          checksumAddress ===
          Web3.utils.toChecksumAddress(parsedPendingOrIncludedTx.to);
        const isDaiTransfer = parsedPendingOrIncludedTx.hasOwnProperty(
          'dai_tr'
        );
        let isIncomingDaiTx;
        if (isDaiTransfer) {
          isIncomingDaiTx =
            checksumAddress ===
            Web3.utils.toChecksumAddress(parsedPendingOrIncludedTx.dai_tr.to);
        }
        const isIncomingTx = isIncomingEthTx || isIncomingDaiTx;
        const isOutgoingTx =
          checksumAddress ===
          Web3.utils.toChecksumAddress(parsedPendingOrIncludedTx.from);

        if (isPendingState) {
          if (isOutgoingTx) {
            if (!sentTxExist && !includedTxExist && !confirmedTxExist) {
              store.dispatch(
                addPendingOrIncludedTransaction(parsedPendingOrIncludedTx)
              );
              store.dispatch(incrementTotalTransactions());
            } else if (sentTxExist || includedTxExist) {
              store.dispatch(
                updateWithPendingOrIncludedTransaction(
                  parsedPendingOrIncludedTx
                )
              );
            } else if (confirmedTxExist) {
              store.dispatch(
                updateConfirmedTransactionData(parsedPendingOrIncludedTx)
              );
              store.dispatch(
                removeExistingTransactionObject(parsedPendingOrIncludedTx)
              );
            }
          } else if (isIncomingTx) {
            if (!includedTxExist && !confirmedTxExist) {
              store.dispatch(
                addPendingOrIncludedTransaction(parsedPendingOrIncludedTx)
              );
              store.dispatch(incrementTotalTransactions());
            } else if (includedTxExist) {
              store.dispatch(
                updateWithPendingOrIncludedTransaction(
                  parsedPendingOrIncludedTx
                )
              );
            } else if (confirmedTxExist) {
              store.dispatch(
                updateConfirmedTransactionData(parsedPendingOrIncludedTx)
              );
              store.dispatch(
                removeExistingTransactionObject(parsedPendingOrIncludedTx)
              );
            }
          } else {
            LogUtilities.logInfo(
              'unknown pending transaction ===>',
              parsedPendingOrIncludedTx
            );
          }
        } else if (isIncludedState) {
          if (isOutgoingTx) {
            if (!sentTxExist && !pendingTxExist && !confirmedTxExist) {
              store.dispatch(
                addPendingOrIncludedTransaction(parsedPendingOrIncludedTx)
              );
              store.dispatch(incrementTotalTransactions());
            } else if (sentTxExist || pendingTxExist) {
              store.dispatch(
                updateWithPendingOrIncludedTransaction(
                  parsedPendingOrIncludedTx
                )
              );
            } else if (confirmedTxExist) {
              store.dispatch(
                updateConfirmedTransactionData(parsedPendingOrIncludedTx)
              );
              store.dispatch(
                removeExistingTransactionObject(parsedPendingOrIncludedTx)
              );
            }
          } else if (isIncomingTx) {
            if (!pendingTxExist && !confirmedTxExist) {
              store.dispatch(
                addPendingOrIncludedTransaction(parsedPendingOrIncludedTx)
              );
              store.dispatch(incrementTotalTransactions());
            } else if (pendingTxExist) {
              store.dispatch(
                updateWithPendingOrIncludedTransaction(
                  parsedPendingOrIncludedTx
                )
              );
            } else if (confirmedTxExist) {
              store.dispatch(
                updateConfirmedTransactionData(parsedPendingOrIncludedTx)
              );
              store.dispatch(
                removeExistingTransactionObject(parsedPendingOrIncludedTx)
              );
            }
          } else {
            LogUtilities.logInfo(
              'unknown included transaction ===>',
              parsedPendingOrIncludedTx
            );
          }
        }
      } else if (isConfirmedState) {
        const parsedConfirmedTx = TransactionUtilities.parseConfirmedTransaction(
          txStateMessage
        );
        let sentTxExist;
        let pendingTxExist;
        let includedTxExist;
        let txExist;
        if (transactionsExist) {
          sentTxExist = transactionsHistory.some(
            transaction =>
              transaction.nonce === parsedConfirmedTx.nonce &&
              transaction.state === 'sent'
          );
          pendingTxExist = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedConfirmedTx.hash &&
              transaction.state === 'pending'
          );
          includedTxExist = transactionsHistory.some(
            transaction =>
              transaction.hash === parsedConfirmedTx.hash &&
              transaction.state === 'included'
          );
          txExist = sentTxExist || pendingTxExist || includedTxExist;
        }
        if (txExist) {
          store.dispatch(updateTransactionState(parsedConfirmedTx));
        } else if (!txExist) {
          store.dispatch(addConfirmedTransaction(parsedConfirmedTx));
        } else {
          LogUtilities.logInfo(
            'unknown confirmed transaction ===>',
            parsedConfirmedTx
          );
        }
      }
    });
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
    if (errorMessage.message === 'nonce too low') {
      transactionsHistory.map(transaction => {
        if (parseInt(downstreamMessage.data.nonce) === transaction.nonce) {
          store.dispatch(updateErrorSentTransaction(transaction.nonce));
        }
      });
    }
  }
});
