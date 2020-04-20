'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionData: {
    compound: {
      amount: ''
    },
    poolTogether: {
      amount: ''
    }
  }
};

const outgoingTransactionData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          compound: action.payload
        }
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          poolTogether: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionData;
