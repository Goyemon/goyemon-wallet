'use strict';
import { SAVE_EMPTY_TRANSACTION, SAVE_EXISTING_TRANSACTIONS, ADD_SENT_TRANSACTION, ADD_PENDING_TRANSACTION, UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import daiToken from '../contracts/DaiToken';

export function saveEmptyTransaction(emptyTransaction) {
  return function (dispatch) {
    try {
      const parsedEmptyTransaction = JSON.parse(emptyTransaction);
      dispatch(saveEmptyTransactionSuccess(parsedEmptyTransaction));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveEmptyTransactionSuccess = (parsedEmptyTransaction) => ({
  type: SAVE_EMPTY_TRANSACTION,
  payload: parsedEmptyTransaction
})

export function saveExistingTransactions(transactions) {
  return function (dispatch) {
    try {
      const parsedExistingTransactions = TransactionUtilities.parseExistingTransactions(transactions);
      dispatch(saveExistingTransactionsSuccess(parsedExistingTransactions));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveExistingTransactionsSuccess = (parsedExistingTransactions) => ({
  type: SAVE_EXISTING_TRANSACTIONS,
  payload: parsedExistingTransactions
})

export function addSentTransaction(transactionObject) {
  return async function (dispatch) {
    let parsedSentTransaction;
    try {
      if(transactionObject.to != daiToken.daiTokenAddress) {
        parsedSentTransaction = TransactionUtilities.parseSentEthTransaction(transactionObject);
      } else if (transactionObject.to === daiToken.daiTokenAddress) {
        parsedSentTransaction = await TransactionUtilities.parseSentDaiTransaction(transactionObject);
      }
      dispatch(addSentTransactionSuccess(parsedSentTransaction));
    } catch(err) {
      console.error(err);
    }
  }
};

const addSentTransactionSuccess = (parsedSentTransaction) => ({
  type: ADD_SENT_TRANSACTION,
  payload: parsedSentTransaction
})

export function addPendingTransaction(transactionObject) {
  return function (dispatch) {
    try {
      let parsedPendingTransaction = TransactionUtilities.parsePendingTransaction(transactionObject);
      dispatch(addPendingTransactionSuccess(parsedPendingTransaction));
    } catch(err) {
      console.error(err);
    }
  }
};

const addPendingTransactionSuccess = (parsedPendingTransaction) => ({
  type: ADD_PENDING_TRANSACTION,
  payload: parsedPendingTransaction
})

export function updateTransactionState(updatedTransaction) {
  return function (dispatch) {
    try {
      dispatch(updateTransactionStateSuccess(updatedTransaction));
    } catch(err) {
      console.error(err);
    }
  }
};

const updateTransactionStateSuccess = (updatedTransaction) => ({
  type: UPDATE_TRANSACTION_STATE,
  payload: updatedTransaction
})
