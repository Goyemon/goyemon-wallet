'use strict';
import { SAVE_NET_INFO } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function saveNetInfo(netInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveNetInfoSuccess(netInfo));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveNetInfoSuccess = (netInfo) => ({
  type: SAVE_NET_INFO,
  payload: netInfo
});
