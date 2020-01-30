'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function saveOutgoingTransactionObject(outgoingTransactionObject) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionObjectSuccess(outgoingTransactionObject));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveOutgoingTransactionObjectSuccess = (outgoingTransactionObject) => ({
  type: SAVE_OUTGOING_TRANSACTION_OBJECT,
  payload: outgoingTransactionObject
});
