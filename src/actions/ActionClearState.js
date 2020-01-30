'use strict';
import { CLEAR_STATE } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function clearState() {
  return async function (dispatch) {
    try {
      dispatch(clearStateSuccess());
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const clearStateSuccess = () => ({
  type: CLEAR_STATE
});
