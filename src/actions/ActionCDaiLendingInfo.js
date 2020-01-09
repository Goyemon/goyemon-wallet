'use strict';
import { SAVE_CDAI_LENDING_INFO } from '../constants/ActionTypes';

export function saveCDaiLendingInfo(cDaiLendingInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiLendingInfoSuccess(cDaiLendingInfo));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveCDaiLendingInfoSuccess = (cDaiLendingInfo) => ({
  type: SAVE_CDAI_LENDING_INFO,
  payload: cDaiLendingInfo
})
