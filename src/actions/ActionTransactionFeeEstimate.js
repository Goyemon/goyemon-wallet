'use strict';
import { SAVE_TRANSACTION_FEE_ESTIMATE_USD } from '../constants/ActionTypes';
import { SAVE_TRANSACTION_FEE_ESTIMATE_ETH } from '../constants/ActionTypes';

export function saveTransactionFeeEstimateUsd(usd) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionFeeEstimateUsdSuccess(usd));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveTransactionFeeEstimateUsdSuccess = (usd) => ({
  type: SAVE_TRANSACTION_FEE_ESTIMATE_USD,
  payload: usd
})

export function saveTransactionFeeEstimateEth(eth) {
  return async function (dispatch) {
    try {
      dispatch(saveTransactionFeeEstimateEthSuccess(eth));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveTransactionFeeEstimateEthSuccess = (eth) => ({
  type: SAVE_TRANSACTION_FEE_ESTIMATE_ETH,
  payload: eth
})
