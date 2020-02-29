'use strict';
import {
  INCREMENT_TOTAL_TRANSACTIONS,
  SAVE_TOTAL_TRANSACTIONS
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  totalTransactions: null
};

const totalTransactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT_TOTAL_TRANSACTIONS:
      return {
        ...state,
        totalTransactions: parseInt(state.totalTransactions) + action.payload
      };
    case SAVE_TOTAL_TRANSACTIONS:
      return { ...state, totalTransactions: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default totalTransactions;
