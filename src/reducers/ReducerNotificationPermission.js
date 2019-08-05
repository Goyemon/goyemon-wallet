'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  permission: null
};

const permission = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_NOTIFICATION_PERMISSION:
      return { ...state, permission: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default permission;
