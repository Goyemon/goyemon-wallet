'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveOutgoingTransactionObject(outgoingTransactionObject) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionObjectSuccess(outgoingTransactionObject));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionObjectSuccess = (outgoingTransactionObject) => ({
  type: SAVE_OUTGOING_TRANSACTION_OBJECT,
  payload: outgoingTransactionObject
});
