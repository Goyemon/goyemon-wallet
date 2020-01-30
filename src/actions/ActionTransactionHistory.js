'use strict';
import { SAVE_EMPTY_TRANSACTION, SAVE_EXISTING_TRANSACTIONS, ADD_SENT_TRANSACTION, ADD_PENDING_OR_INCLUDED_TRANSACTION, UPDATE_PENDING_OR_INCLUDED_TRANSACTION, UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';
import cDaiContract from '../contracts/cDaiContract';
import daiTokenContract from '../contracts/daiTokenContract';
import DebugUtilities from '../utilities/DebugUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

export function saveEmptyTransaction(emptyTransaction) {
  return function (dispatch) {
    try {
      const parsedEmptyTransaction = JSON.parse(emptyTransaction);
      dispatch(saveEmptyTransactionSuccess(parsedEmptyTransaction));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveEmptyTransactionSuccess = (parsedEmptyTransaction) => ({
  type: SAVE_EMPTY_TRANSACTION,
  payload: parsedEmptyTransaction
});

export function saveExistingTransactions(transactions) {
  return function (dispatch) {
    try {
      dispatch(saveExistingTransactionsSuccess(transactions));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveExistingTransactionsSuccess = (parsedExistingTransactions) => ({
  type: SAVE_EXISTING_TRANSACTIONS,
  payload: parsedExistingTransactions
});

export function addSentTransaction(transactionObject) {
  return async function (dispatch) {
    let parsedSentTransaction;
    let functionSignature;
    if (transactionObject.data) {
      functionSignature = transactionObject.data.substring(0, 10);
    }
    const transferFunctionSignature = '0xa9059cbb';
    const approveFunctionSignature = '0x095ea7b3';
    const mintFunctionSignature = '0xa0712d68';
    const redeemUnderlyingFunctionSignature = '0x852a12e3';

    const isToDaiTokenContract = transactionObject.to === daiTokenContract.daiTokenAddress;
    const isToCDaiContract = transactionObject.to === cDaiContract.cDaiAddress;

    try {
      if (
        isToDaiTokenContract &&
        functionSignature === transferFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentDaiTransaction(transactionObject);
      } else if (
        isToDaiTokenContract &&
        functionSignature === approveFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentDaiApproveTransaction(transactionObject);
      } else if (
        isToCDaiContract &&
        functionSignature === mintFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentCDaiMintTransaction(transactionObject);
      } else if (
        isToCDaiContract &&
        functionSignature === redeemUnderlyingFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentCDaiRedeemUnderlyingTransaction(transactionObject);
      } else {
        parsedSentTransaction = TransactionUtilities.parseSentEthTransaction(transactionObject);
      }
      dispatch(addSentTransactionSuccess(parsedSentTransaction));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const addSentTransactionSuccess = (parsedSentTransaction) => ({
  type: ADD_SENT_TRANSACTION,
  payload: parsedSentTransaction
});

export function addPendingOrIncludedTransaction(transactionObject) {
  return function (dispatch) {
    try {
      dispatch(addPendingOrIncludedTransactionSuccess(transactionObject));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const addPendingOrIncludedTransactionSuccess = (parsedTransaction) => ({
  type: ADD_PENDING_OR_INCLUDED_TRANSACTION,
  payload: parsedTransaction
});

export function updateWithPendingOrIncludedTransaction(transactionObject) {
  return function (dispatch) {
    try {
      dispatch(updateWithPendingOrIncludedTransactionSuccess(transactionObject));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const updateWithPendingOrIncludedTransactionSuccess = (parsedTransaction) => ({
  type: UPDATE_PENDING_OR_INCLUDED_TRANSACTION,
  payload: parsedTransaction
});

export function updateTransactionState(updatedTransaction) {
  return function (dispatch) {
    try {
      dispatch(updateTransactionStateSuccess(updatedTransaction));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const updateTransactionStateSuccess = (updatedTransaction) => ({
  type: UPDATE_TRANSACTION_STATE,
  payload: updatedTransaction
});
