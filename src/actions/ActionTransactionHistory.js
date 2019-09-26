'use strict';
import { SAVE_EXISTING_TRANSACTIONS, ADD_PENDING_TRANSACTION, UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';
import TransactionController from '../wallet-core/TransactionController.ts';

export function saveExistingTransactions(transactions) {
  return function (dispatch) {
    try {
      const parsedExistingTransactions = TransactionController.parseExistingTransactions(transactions);
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
      let parsedPendingTransaction = TransactionController.parsePendingTransaction(transactionObject);
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
