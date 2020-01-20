'use strict';
import { SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  daiAmount: ''
};

const daiAmount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT:
      return { ...state, daiAmount: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default daiAmount;
