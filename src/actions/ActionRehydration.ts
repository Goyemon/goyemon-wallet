'use strict';
import { REHYDRATION_COMPLETE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function rehydrationComplete(completed: any) {
  return async function (dispatch: any) {
    try {
      dispatch(rehydrationCompleteSuccess(completed));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const rehydrationCompleteSuccess = (completed: any) => ({
  type: REHYDRATION_COMPLETE,
  payload: completed
});
