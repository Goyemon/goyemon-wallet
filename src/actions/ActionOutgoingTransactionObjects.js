'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';

export function saveOutgoingTransactionObject(outgoingTransactionObject) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionObjectSuccess(outgoingTransactionObject));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOutgoingTransactionObjectSuccess = (outgoingTransactionObject) => ({
  type: SAVE_OUTGOING_TRANSACTION_OBJECT,
  payload: outgoingTransactionObject
})
