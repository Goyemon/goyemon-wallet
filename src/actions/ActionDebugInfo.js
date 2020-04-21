'use strict';
import {
  SAVE_FCM_TOKEN,
  SAVE_OTHER_DEBUG_INFO
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveFcmToken(fcmToken) {
  return async function (dispatch) {
    try {
      dispatch(saveFcmTokenSuccess(fcmToken));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveFcmTokenSuccess = (fcmToken) => ({
  type: SAVE_FCM_TOKEN,
  payload: fcmToken
});

export function saveOtherDebugInfo(otherDebugInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveOtherDebugInfoSuccess(otherDebugInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOtherDebugInfoSuccess = (otherDebugInfo) => ({
  type: SAVE_OTHER_DEBUG_INFO,
  payload: otherDebugInfo
});
