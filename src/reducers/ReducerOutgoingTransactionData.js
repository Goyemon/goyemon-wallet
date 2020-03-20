'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_AMOUNT } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_TOADDRESS } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_APPROVE_AMOUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionData: {
    amount: '',
    toaddress: '',
    approveAmount: ''
  }
};

const outgoingTransactionData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_DATA_AMOUNT:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          amount: action.payload
        }
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_TOADDRESS:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          toaddress: action.payload
        }
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_APPROVE_AMOUNT:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          approveAmount: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionData;
