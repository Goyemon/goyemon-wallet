'use strict';
import { SAVE_DAI_EXCHANGE_RESERVE } from '../constants/ActionTypes';
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
