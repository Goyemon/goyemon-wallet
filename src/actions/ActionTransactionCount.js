'use strict';
import { SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';

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
