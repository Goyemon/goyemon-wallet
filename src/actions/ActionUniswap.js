'use strict';
import {
  SAVE_UNISWAPV2_WETH_DAI_RESERVE,
  UPDATE_SLIPPAGE_CHOSEN
} from '../constants/ActionTypes';
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
  payload: daiExchangeReserve
  type: SAVE_UNISWAPV2_WETH_DAI_RESERVE,
});

export function updateSlippageChosen(key) {
  return async function (dispatch) {
    try {
      dispatch(updateSlippageChosenSuccess(key));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateSlippageChosenSuccess = (key) => ({
  type: UPDATE_SLIPPAGE_CHOSEN,
  payload: key
});
