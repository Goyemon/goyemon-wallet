'use strict';
import {
  SAVE_OUTGOING_TRANSACTION_DATA_SEND,
  SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND,
  SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER,
  SAVE_OUTGOING_TRANSACTION_DATA_SWAP
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionData: {
    send: {
      toaddress: '',
      amount: '',
      gasLimit: '',
      transactionObject: {}
    },
    compound: {
      amount: '',
      gasLimit: '',
      approveTransactionObject: {},
      transactionObject: {}
    },
    poolTogether: {
      amount: '',
      gasLimit: '',
      approveTransactionObject: {},
      transactionObject: {}
    },
    swap: {
      sold: '',
      bought: '',
      minBought: '',
      slippage: '',
      gasLimit: '',
      transactionObject: {}
    }
  }
};

const outgoingTransactionData = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_DATA_SEND:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          send: action.payload
        }
      };
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
    case SAVE_OUTGOING_TRANSACTION_DATA_SWAP:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          swap: action.payload
        }
      };

    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionData;
