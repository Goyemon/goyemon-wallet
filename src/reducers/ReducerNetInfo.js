'use strict';
import { SAVE_NET_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  netInfo: true
};

const netInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_NET_INFO:
      return { ...state, netInfo: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default netInfo;
