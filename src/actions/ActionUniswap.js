'use strict';
import {
  SAVE_DAI_EXCHANGE_RESERVE,
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
  type: SAVE_DAI_EXCHANGE_RESERVE,
  payload: daiExchangeReserve
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
