'use strict';
import { SAVE_FCM_MSG } from '../constants/ActionTypes';
import { APPEND_FCM_MSG } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function saveFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(saveFcmMsgSuccess(fcmMsg));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveFcmMsgSuccess = (fcmMsg) => ({
  type: SAVE_FCM_MSG,
  payload: fcmMsg
})

export function appendFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(appendFcmMsgSuccess(fcmMsg));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const appendFcmMsgSuccess = (fcmMsg) => ({
  type: APPEND_FCM_MSG,
  payload: fcmMsg
});
