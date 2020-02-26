'use strict';
import { SAVE_EMPTY_TRANSACTION, SAVE_EXISTING_TRANSACTIONS, ADD_SENT_TRANSACTION, ADD_PENDING_OR_INCLUDED_TRANSACTION, UPDATE_PENDING_OR_INCLUDED_TRANSACTION, UPDATE_TRANSACTION_STATE, UPDATE_ERROR_SENT_TRANSACTION } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
const GlobalConfig = require('../config.json');

export function saveEmptyTransaction(emptyTransaction) {
  return function (dispatch) {
    try {
      const parsedEmptyTransaction = JSON.parse(emptyTransaction);
      dispatch(saveEmptyTransactionSuccess(parsedEmptyTransaction));
    } catch(err) {
      LogUtilities.logError(err);
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
      LogUtilities.logError(err);
    }
  }
};

const saveExistingTransactionsSuccess = (parsedExistingTransactions) => ({
  type: SAVE_EXISTING_TRANSACTIONS,
  payload: parsedExistingTransactions
});

export function addSentTransaction(transactionObject) {
  return async function (dispatch) {
    const isToDaiTokenContract = transactionObject.to === GlobalConfig.DAIcontract;
    const isToCDaiContract = transactionObject.to === GlobalConfig.cDAIcontract;

    let functionSignature;
    if (transactionObject.data) {
      functionSignature = transactionObject.data.substring(0, 10);
    }
    const isTransferFunctionSignature = functionSignature === '0xa9059cbb';
    const isApproveFunctionSignature = functionSignature === '0x095ea7b3';
    const isMintFunctionSignature = functionSignature === '0xa0712d68';
    const isRedeemUnderlyingFunctionSignature = functionSignature === '0x852a12e3';

    let parsedSentTransaction;

    try {
      if (
        isToDaiTokenContract && isTransferFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentDaiTransaction(transactionObject);
      } else if (
        isToDaiTokenContract && isApproveFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentDaiApproveTransaction(transactionObject);
      } else if (
        isToCDaiContract && isMintFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentCDaiMintTransaction(transactionObject);
      } else if (
        isToCDaiContract && isRedeemUnderlyingFunctionSignature
      ) {
        parsedSentTransaction = await TransactionUtilities.parseSentCDaiRedeemUnderlyingTransaction(transactionObject);
      } else {
        parsedSentTransaction = TransactionUtilities.parseSentEthTransaction(transactionObject);
      }
      dispatch(addSentTransactionSuccess(parsedSentTransaction));
    } catch(err) {
      LogUtilities.logError(err);
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
      LogUtilities.logError(err);
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
      LogUtilities.logError(err);
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
      LogUtilities.logError(err);
    }
  }
};

const updateTransactionStateSuccess = (updatedTransaction) => ({
  type: UPDATE_TRANSACTION_STATE,
  payload: updatedTransaction
});

export function updateErrorSentTransaction(nonce) {
  return async function (dispatch) {
    try {
      dispatch(updateErrorSentTransactionSuccess(nonce));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const updateErrorSentTransactionSuccess = (nonce) => ({
  type: UPDATE_ERROR_SENT_TRANSACTION,
  payload: nonce
});
