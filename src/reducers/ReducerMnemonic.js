'use strict';
import { SAVE_MNEMONIC } from '../constants/ActionTypes';

const INITIAL_STATE = {
  mnemonic: ''
};

const mnemonic = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_MNEMONIC:
      return { ...state, mnemonic: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default mnemonic;
