'use strict';
import { SAVE_CDAI_LENDING_INFO, SAVE_DAI_APPROVAL_INFO } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveCDaiLendingInfo(cDaiLendingInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiLendingInfoSuccess(cDaiLendingInfo));
    } catch(err) {
      WalletUtilities.logError(err);
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
      WalletUtilities.logError(err);
    }
  }
};

const saveDaiApprovalInfoSuccess = (daiApprovalInfo) => ({
  type: SAVE_DAI_APPROVAL_INFO,
  payload: daiApprovalInfo
});
