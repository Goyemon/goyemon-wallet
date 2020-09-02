'use strict';
import { SAVE_TRANSACTIONS_LOADED } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactionsLoaded: null
};

const transactionsLoaded = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SAVE_TRANSACTIONS_LOADED:
      return { ...state, transactionsLoaded: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default transactionsLoaded;
