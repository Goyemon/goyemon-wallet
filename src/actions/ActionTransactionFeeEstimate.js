'use strict';
import { SAVE_TRANSACTION_FEE_ESTIMATE_ETH, SAVE_TRANSACTION_FEE_ESTIMATE_USD } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveTransactionFeeEstimateEth(eth) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionFeeEstimateEthSuccess(eth));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const saveTransactionFeeEstimateEthSuccess = (eth) => ({
  type: SAVE_TRANSACTION_FEE_ESTIMATE_ETH,
  payload: eth
});

export function saveTransactionFeeEstimateUsd(usd) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionFeeEstimateUsdSuccess(usd));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const saveTransactionFeeEstimateUsdSuccess = (usd) => ({
  type: SAVE_TRANSACTION_FEE_ESTIMATE_USD,
  payload: usd
});
