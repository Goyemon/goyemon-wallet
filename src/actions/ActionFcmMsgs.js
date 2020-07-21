'use strict';
import { SAVE_FCM_MSG, APPEND_FCM_MSG } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(saveFcmMsgSuccess(fcmMsg));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveFcmMsgSuccess = (fcmMsg) => ({
  type: SAVE_FCM_MSG,
  payload: fcmMsg
});

export function appendFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(appendFcmMsgSuccess(fcmMsg));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const appendFcmMsgSuccess = (fcmMsg) => ({
  type: APPEND_FCM_MSG,
  payload: fcmMsg
});
