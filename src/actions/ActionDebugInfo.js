'use strict';
import { SAVE_FCM_TOKEN } from '../constants/ActionTypes';
import { SAVE_OTHER_DEBUG_INFO } from '../constants/ActionTypes';

export function saveFcmToken(fcmToken) {
  return async function (dispatch) {
    try {
      dispatch(saveFcmTokenSuccess(fcmToken));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveFcmTokenSuccess = (fcmToken) => ({
  type: SAVE_FCM_TOKEN,
  payload: fcmToken
})

export function saveOtherDebugInfo(otherDebugInfo) {
  return async function (dispatch) {
    try {
      dispatch(saveOtherDebugInfoSuccess(otherDebugInfo));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOtherDebugInfoSuccess = (otherDebugInfo) => ({
  type: SAVE_OTHER_DEBUG_INFO,
  payload: otherDebugInfo
})
