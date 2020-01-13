'use strict';
import { SAVE_FCM_MSG } from '../constants/ActionTypes';
import { APPEND_FCM_MSG } from '../constants/ActionTypes';

const INITIAL_STATE = {
  fcmMsgs: {}
};

const fcmMsgs = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_FCM_MSG:
      return {
        fcmMsgs: {
          [action.payload.uid]: [action.payload]
        }
      };
    case APPEND_FCM_MSG:
      return {
        fcmMsgs: {
          [action.payload.uid]: [...state.fcmMsgs[action.payload.uid], action.payload]
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default fcmMsgs;
