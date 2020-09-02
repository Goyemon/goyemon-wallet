'use strict';
import {
  SAVE_DAI_COMPOUND_APPROVAL,
  SAVE_DAI_POOLTOGETHER_APPROVAL
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities';

export function saveDaiCompoundApproval(daiCompoundApproval: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveDaiCompoundApprovalSuccess(daiCompoundApproval));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiCompoundApprovalSuccess = (daiCompoundApproval: any) => ({
  type: SAVE_DAI_COMPOUND_APPROVAL,
  payload: daiCompoundApproval
});

export function saveDaiPoolTogetherApproval(daiPoolTogetherApproval: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveDaiPoolTogetherApprovalSuccess(daiPoolTogetherApproval));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiPoolTogetherApprovalSuccess = (daiPoolTogetherApproval: any) => ({
  type: SAVE_DAI_POOLTOGETHER_APPROVAL,
  payload: daiPoolTogetherApproval
});
