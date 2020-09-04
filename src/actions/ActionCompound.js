"use strict";
import { SAVE_COMPOUND_DAI_INFO } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function saveCompoundDaiInfo(compoundDaiInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveCompoundDaiInfoSuccess(compoundDaiInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCompoundDaiInfoSuccess = (compoundDaiInfo) => ({
  type: SAVE_COMPOUND_DAI_INFO,
  payload: compoundDaiInfo
});
