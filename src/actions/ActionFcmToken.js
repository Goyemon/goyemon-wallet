'use strict';
import { SAVE_FCM_TOKEN } from '../constants/ActionTypes';

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
