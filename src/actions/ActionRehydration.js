"use strict";
import { REHYDRATION_COMPLETE } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function rehydrationComplete(completed) {
  return async function (dispatch) {
    try {
      dispatch(rehydrationCompleteSuccess(completed));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const rehydrationCompleteSuccess = (completed) => ({
  type: REHYDRATION_COMPLETE,
  payload: completed
});
