'use strict';
import { SAVE_COMPOUND_DAI_INFO } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities';

export function saveCompoundDaiInfo(compoundDaiInfo: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveCompoundDaiInfoSuccess(compoundDaiInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCompoundDaiInfoSuccess = (compoundDaiInfo: any) => ({
  type: SAVE_COMPOUND_DAI_INFO,
  payload: compoundDaiInfo
});
