'use strict';
import { SAVE_EMPTY_TRANSACTION, SAVE_EXISTING_TRANSACTIONS, ADD_PENDING_TRANSACTION, UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

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
