'use strict';
import { SAVE_TRANSACTION_FEE_ESTIMATE_ETH, SAVE_TRANSACTION_FEE_ESTIMATE_USD } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function saveTransactionFeeEstimateEth(eth) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionFeeEstimateEthSuccess(eth));
    } catch(err) {
      DebugUtilities.logError(err);
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
      DebugUtilities.logError(err);
    }
  }
};

const saveTransactionFeeEstimateUsdSuccess = (usd) => ({
  type: SAVE_TRANSACTION_FEE_ESTIMATE_USD,
  payload: usd
});
