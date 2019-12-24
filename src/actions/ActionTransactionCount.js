'use strict';
import { SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';
import { INCREMENT_TRANSACTION_COUNT } from '../constants/ActionTypes';

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

export function incrementTransactionCount() {
  return async function (dispatch) {
    try {
      dispatch(incrementTransactionCountSuccess());
    } catch(err) {
      console.error(err);
    }
  }
};

const incrementTransactionCountSuccess = () => ({
  type: INCREMENT_TRANSACTION_COUNT,
  payload: 1
})
