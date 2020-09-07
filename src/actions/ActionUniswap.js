"use strict";
import {
  SAVE_UNISWAPV2_WETH_DAI_RESERVE,
  UPDATE_SLIPPAGE_CHOSEN
} from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function saveUniswapV2WETHxDAIReserve(reserves) {
  return async function (dispatch) {
    try {
      dispatch(saveUniswapV2WETHxDAIReserveSuccess(reserves));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveUniswapV2WETHxDAIReserveSuccess = (reserves) => ({
  type: SAVE_UNISWAPV2_WETH_DAI_RESERVE,
  payload: reserves
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
