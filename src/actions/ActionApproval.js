'use strict';
import { SAVE_DAI_COMPOUND_APPROVAL} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveDaiCompoundApproval(daiCompoundApproval) {
  return async function(dispatch) {
    try {
      dispatch(saveDaiCompoundApprovalSuccess(daiCompoundApproval));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiCompoundApprovalSuccess = daiCompoundApproval => ({
  type: SAVE_DAI_COMPOUND_APPROVAL,
  payload: daiCompoundApproval
});
