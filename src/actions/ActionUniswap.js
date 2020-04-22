'use strict';
import { SAVE_DAI_EXCHANGE_RESERVE, SAVE_SWAP_SLIPPAGE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveDaiExchangeReserve(daiExchangeReserve) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiExchangeReserveSuccess(daiExchangeReserve));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiExchangeReserveSuccess = (daiExchangeReserve) => ({
  type: SAVE_DAI_EXCHANGE_RESERVE,
  payload: daiExchangeReserve
});

export function saveSwapSlippage(slippage) {
  return async function (dispatch) {
    try {
      dispatch(saveSwapSlippageSuccess(slippage));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveSwapSlippageSuccess = (slippage) => ({
  type: SAVE_SWAP_SLIPPAGE,
  payload: slippage
});
