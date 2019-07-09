'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionObject: {}
};

const outgoingTransactionObject = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_OBJECT:
      return { ...state, outgoingTransactionObject: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionObject;
