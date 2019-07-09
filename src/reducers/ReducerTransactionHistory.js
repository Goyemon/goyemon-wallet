'use strict';
import { GET_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_NEW_TRANSACTION } from '../constants/ActionTypes';
import { ADD_SENT_TRANSACTION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: []
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EXISTING_TRANSACTIONS:
      return {
        transactions: [...state.transactions, ...action.payload]
      };
    case ADD_NEW_TRANSACTION:
      return {
        transactions: [action.payload, ...state.transactions]
      };
    case ADD_SENT_TRANSACTION:
      return {
        transactions: [action.payload, ...state.transactions]
      };
    default:
      return state;
  }
};

export default transactions;
