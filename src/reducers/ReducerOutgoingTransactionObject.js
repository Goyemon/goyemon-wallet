'use strict';
import { SAVE_OUTGOING_TRANSACTION_OBJECT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionObjects: []
};

const outgoingTransactionObjects = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_OBJECT:
      return {
        outgoingTransactionObjects: [...state.outgoingTransactionObjects, action.payload]
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionObjects;
