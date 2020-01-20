'use strict';
import { SAVE_CDAI_LENDING_INFO, SAVE_DAI_APPROVAL_INFO } from '../constants/ActionTypes';

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

export function saveDaiApprovalInfo(daiApprovalInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiApprovalInfoSuccess(daiApprovalInfo));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveDaiApprovalInfoSuccess = (daiApprovalInfo) => ({
  type: SAVE_DAI_APPROVAL_INFO,
  payload: daiApprovalInfo
})
