'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_SEND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_SWAP } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_SWAP_SLIPPAGE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  outgoingTransactionData: {
    send: {
      toaddress: '',
      amount: '',
    },
    compound: {
      amount: '',
    },
    poolTogether: {
      amount: '',
    },
    swap: {
      sold: '',
      bought: '',
      slippage: 0.5,
      minBought: '',
    },
  },
};

const outgoingTransactionData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_OUTGOING_TRANSACTION_DATA_SEND:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          send: action.payload,
        },
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          compound: action.payload,
        },
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER:
      return {
        outgoingTransactionData: {
          ...state.outgoingTransactionData,
          poolTogether: action.payload,
        },
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_SWAP:
      return {
        outgoingTransactionData: {
          swap: {
            ...state.outgoingTransactionData.swap,
            ...action.payload,
          },
        },
      };
    case SAVE_OUTGOING_TRANSACTION_DATA_SWAP_SLIPPAGE:
      return {
        outgoingTransactionData: {
          swap: {
            ...state.outgoingTransactionData.swap,
            slippage: action.payload,
          },
        },
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default outgoingTransactionData;
