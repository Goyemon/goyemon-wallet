'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  notificationPermission: null
};

const notificationPermission = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_NOTIFICATION_PERMISSION:
      return { ...state, notificationPermission: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default notificationPermission;
