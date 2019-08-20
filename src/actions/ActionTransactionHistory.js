'use strict';
import { GET_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_PENDING_TRANSACTION } from '../constants/ActionTypes';
import { UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';
import axios from 'axios';
import TransactionController from '../wallet-core/TransactionController.ts';

export function getExistingTransactions(transactions) {
  return function (dispatch) {
    try {
      const parsedExistingTransactions = TransactionController.parseExistingTransactions(transactions);
      dispatch(getExistingTransactionsSuccess(parsedExistingTransactions));
    } catch(err) {
      console.error(err);
    }
  }
};

const getExistingTransactionsSuccess = (parsedExistingTransactions) => ({
  type: GET_EXISTING_TRANSACTIONS,
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
