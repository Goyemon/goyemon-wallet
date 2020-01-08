'use strict';
import { ADD_FCM_MSG } from '../constants/ActionTypes';
import { APPEND_FCM_MSG } from '../constants/ActionTypes';

export function addFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(addFcmMsgSuccess(fcmMsg));
    } catch(err) {
      console.error(err);
    }
  }
};

const addFcmMsgSuccess = (fcmMsg) => ({
  type: ADD_FCM_MSG,
  payload: fcmMsg
})

export function appendFcmMsg(fcmMsg) {
  return async function (dispatch) {
    try {
      dispatch(appendFcmMsgSuccess(fcmMsg));
    } catch(err) {
      console.error(err);
    }
  }
};

const appendFcmMsgSuccess = (fcmMsg) => ({
  type: APPEND_FCM_MSG,
  payload: fcmMsg
})
