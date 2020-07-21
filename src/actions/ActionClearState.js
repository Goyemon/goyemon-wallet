'use strict';
import { CLEAR_STATE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function clearState() {
  return async function (dispatch) {
    try {
      dispatch(clearStateSuccess());
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const clearStateSuccess = () => ({
  type: CLEAR_STATE
});
