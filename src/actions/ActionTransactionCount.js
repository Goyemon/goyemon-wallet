'use strict';
import { INCREMENT_TRANSACTION_COUNT, SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function incrementTotalTransactions() {
  return async function (dispatch) {
    try {
      dispatch(incrementTotalTransactionsSuccess());
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const incrementTotalTransactionsSuccess = () => ({
  type: INCREMENT_TRANSACTION_COUNT,
  payload: 1
});

export function saveTransactionCount(transactionCount) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionCountSuccess(transactionCount));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveTransactionCountSuccess = (transactionCount) => ({
  type: SAVE_TRANSACTION_COUNT,
  payload: transactionCount
});
