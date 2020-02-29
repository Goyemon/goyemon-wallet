'use strict';
import {
  INCREMENT_TOTAL_TRANSACTIONS,
  SAVE_TOTAL_TRANSACTIONS
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function incrementTotalTransactions() {
  return async function(dispatch) {
    try {
      dispatch(incrementTotalTransactionsSuccess());
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const incrementTotalTransactionsSuccess = () => ({
  type: INCREMENT_TOTAL_TRANSACTIONS,
  payload: 1
});

export function saveTotalTransactions(totalTransactions) {
  return async function(dispatch) {
    try {
      dispatch(saveTotalTransactionsSuccess(totalTransactions));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTotalTransactionsSuccess = totalTransactions => ({
  type: SAVE_TOTAL_TRANSACTIONS,
  payload: totalTransactions
});
