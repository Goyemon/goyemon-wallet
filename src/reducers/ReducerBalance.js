'use strict';
import { SAVE_BALANCE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  balance: '0'
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_BALANCE:
      return { ...state, balance: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;
