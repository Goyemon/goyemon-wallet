'use strict';
import { INCREMENT_TRANSACTION_COUNT, SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';

export function incrementTotalTransactions() {
  return async function (dispatch) {
    try {
      dispatch(incrementTotalTransactionsSuccess());
    } catch(err) {
      console.error(err);
    }
  }
};

const incrementTotalTransactionsSuccess = () => ({
  type: INCREMENT_TRANSACTION_COUNT,
  payload: 1
})

export function saveTransactionCount(transactionCount) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionCountSuccess(transactionCount));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveTransactionCountSuccess = (transactionCount) => ({
  type: SAVE_TRANSACTION_COUNT,
  payload: transactionCount
})
