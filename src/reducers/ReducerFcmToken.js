'use strict';
import { SAVE_FCM_TOKEN } from '../constants/ActionTypes';

const INITIAL_STATE = {
  fcmToken: null
};

const fcmToken = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_FCM_TOKEN:
      return { ...state, fcmToken: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default fcmToken;
