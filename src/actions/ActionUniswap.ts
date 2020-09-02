'use strict';
import {
  SAVE_UNISWAPV2_WETH_DAI_RESERVE,
  UPDATE_SLIPPAGE_CHOSEN
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities';

export function saveUniswapV2WETHxDAIReserve(reserves: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveUniswapV2WETHxDAIReserveSuccess(reserves));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveUniswapV2WETHxDAIReserveSuccess = (reserves: any) => ({
  type: SAVE_UNISWAPV2_WETH_DAI_RESERVE,
  payload: reserves
});

export function updateSlippageChosen(key: any) {
  return async function (dispatch: any) {
    try {
      dispatch(updateSlippageChosenSuccess(key));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateSlippageChosenSuccess = (key: any) => ({
  type: UPDATE_SLIPPAGE_CHOSEN,
  payload: key
});
