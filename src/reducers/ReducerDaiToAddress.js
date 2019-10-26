'use strict';
import { SAVE_DAI_TO_ADDRESS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  daiToAddress: ''
};

const daiToAddress = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_TO_ADDRESS:
      return { ...state, daiToAddress: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default daiToAddress;
