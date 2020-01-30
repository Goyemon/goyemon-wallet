'use strict';
import { INCREMENT_TOTAL_TRANSACTIONS, SAVE_TOTAL_TRANSACTIONS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactionCount: null
};

const transactionCount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT_TOTAL_TRANSACTIONS:
      return { ...state, transactionCount: parseInt(state.transactionCount) + action.payload };
    case SAVE_TOTAL_TRANSACTIONS:
      return { ...state, transactionCount: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default transactionCount;
