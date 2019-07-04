'use strict';
import { SAVE_TRANSACTION_OBJECT } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactionObject: {}
};

const transactionObject = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_TRANSACTION_OBJECT:
      return { ...state, transactionObject: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default transactionObject;
