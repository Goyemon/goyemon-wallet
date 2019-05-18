'use strict';
import { SAVE_TRANSACTION_OBJECT } from '../constants/ActionTypes';

export function saveTransactionObject(transactionObject) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionObjectSuccess(transactionObject));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveTransactionObjectSuccess = (transactionObject) => ({
  type: SAVE_TRANSACTION_OBJECT,
  payload: transactionObject
})
