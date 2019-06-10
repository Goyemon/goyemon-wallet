'use strict';
import { GET_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: []
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EXISTING_TRANSACTIONS:
      return {
        transactions: [
          ...state.transactions,
          ...action.payload
        ]
      };
      return {
        ...state,
        transactions: getTransactions
      };
    default:
      return state;
  }
};

export default transactions;
