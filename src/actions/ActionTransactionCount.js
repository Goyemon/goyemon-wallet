'use strict';
import { INCREMENT_TRANSACTION_COUNT, SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function incrementTotalTransactions() {
  return async function (dispatch) {
    try {
      dispatch(incrementTotalTransactionsSuccess());
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const incrementTotalTransactionsSuccess = () => ({
  type: INCREMENT_TRANSACTION_COUNT,
  payload: 1
});

export function saveTransactionCount(transactionCount) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionCountSuccess(transactionCount));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveTransactionCountSuccess = (transactionCount) => ({
  type: SAVE_TRANSACTION_COUNT,
  payload: transactionCount
});
