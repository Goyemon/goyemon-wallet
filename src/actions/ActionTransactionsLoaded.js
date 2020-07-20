'use strict';
import { SAVE_TRANSACTIONS_LOADED } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveTransactionsLoaded(transactionLoaded) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionsLoadedSuccess(transactionLoaded));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTransactionsLoadedSuccess = (transactionLoaded) => ({
  type: SAVE_TRANSACTIONS_LOADED,
  payload: transactionLoaded,
});
