'use strict';
import { SAVE_WEB3 } from '../constants/ActionTypes';

const INITIAL_STATE = {
  web3: {}
};

const web3 = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_WEB3:
      return { ...state, web3: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default web3;
