'use strict';
import {
  SAVE_FCM_TOKEN,
  SAVE_OTHER_DEBUG_INFO
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  debugInfo: {
    fcmToken: null,
    others: []
  }
};

const debugInfo = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SAVE_FCM_TOKEN:
      return { debugInfo: { ...state.debugInfo, fcmToken: action.payload } };
    case SAVE_OTHER_DEBUG_INFO:
      return {
        debugInfo: {
          ...state.debugInfo,
          others: [...state.debugInfo.others, action.payload]
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default debugInfo;
