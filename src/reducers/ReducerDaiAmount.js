'use strict';
import { SAVE_DAI_AMOUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  daiAmount: '10'
};

const daiAmount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_AMOUNT:
      return { ...state, daiAmount: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default daiAmount;
