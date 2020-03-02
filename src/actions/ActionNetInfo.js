'use strict';
import { SAVE_NET_INFO } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveNetInfo(netInfo) {
  return async function(dispatch) {
    try {
      dispatch(saveNetInfoSuccess(netInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveNetInfoSuccess = netInfo => ({
  type: SAVE_NET_INFO,
  payload: netInfo
});
