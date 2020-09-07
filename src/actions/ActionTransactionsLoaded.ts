"use strict";
import { SAVE_TRANSACTIONS_LOADED } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

export function saveTransactionsLoaded(transactionLoaded: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveTransactionsLoadedSuccess(transactionLoaded));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTransactionsLoadedSuccess = (transactionLoaded: any) => ({
  type: SAVE_TRANSACTIONS_LOADED,
  payload: transactionLoaded
});
