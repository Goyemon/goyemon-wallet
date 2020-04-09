'use strict';
import { SAVE_CDAI_LENDING_INFO } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveCDaiLendingInfo(cDaiLendingInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiLendingInfoSuccess(cDaiLendingInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCDaiLendingInfoSuccess = (cDaiLendingInfo) => ({
  type: SAVE_CDAI_LENDING_INFO,
  payload: cDaiLendingInfo,
});
