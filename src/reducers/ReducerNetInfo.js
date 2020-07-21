'use strict';
import { SAVE_NET_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  isOnline: true
};

const isOnline = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_NET_INFO:
      return { ...state, isOnline: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default isOnline;
