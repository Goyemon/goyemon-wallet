"use strict";
import {
  SAVE_FCM_TOKEN,
  SAVE_OTHER_DEBUG_INFO
} from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

export function saveFcmToken(fcmToken: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveFcmTokenSuccess(fcmToken));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveFcmTokenSuccess = (fcmToken: any) => ({
  type: SAVE_FCM_TOKEN,
  payload: fcmToken
});

export function saveOtherDebugInfo(otherDebugInfo: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveOtherDebugInfoSuccess(otherDebugInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOtherDebugInfoSuccess = (otherDebugInfo: any) => ({
  type: SAVE_OTHER_DEBUG_INFO,
  payload: otherDebugInfo
});
