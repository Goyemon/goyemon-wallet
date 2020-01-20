'use strict';
import { SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingDaiTransactionAmount: ''
};

const outgoingDaiTransactionAmount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT:
      return { ...state, outgoingDaiTransactionAmount: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingDaiTransactionAmount;
