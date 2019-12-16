'use strict';
import { SAVE_TRANSACTION_COUNT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactionCount: null
};

const transactionCount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_TRANSACTION_COUNT:
      return { ...state, transactionCount: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default transactionCount;
