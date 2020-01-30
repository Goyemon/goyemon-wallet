'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveOutgoingTransactionObject(outgoingTransactionObject) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionObjectSuccess(outgoingTransactionObject));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveOutgoingTransactionObjectSuccess = (outgoingTransactionObject) => ({
  type: SAVE_OUTGOING_TRANSACTION_OBJECT,
  payload: outgoingTransactionObject
});
