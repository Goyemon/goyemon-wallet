'use strict';
import { SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT } from '../constants/ActionTypes';
import { SAVE_OUTGOING_DAI_TRANSACTION_TO_ADDRESS } from '../constants/ActionTypes';
import { SAVE_OUTGOING_DAI_TRANSACTION_APPROVE_AMOUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingDaiTransactionData: {
    amount: '',
    toAddress: '',
    approveAmount: ''
  }
};

const outgoingDaiTransactionData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT:
      return {
        outgoingDaiTransactionData: { ...state.outgoingDaiTransactionData, amount: action.payload }
      };
    case SAVE_OUTGOING_DAI_TRANSACTION_TO_ADDRESS:
      return {
        outgoingDaiTransactionData: {
          ...state.outgoingDaiTransactionData,
          toAddress: action.payload
        }
      };
    case SAVE_OUTGOING_DAI_TRANSACTION_APPROVE_AMOUNT:
      return {
        outgoingDaiTransactionData: {
          ...state.outgoingDaiTransactionData,
          approveAmount: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingDaiTransactionData;
