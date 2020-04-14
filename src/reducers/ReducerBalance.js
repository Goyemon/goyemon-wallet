'use strict';
import {
  SAVE_WEI_BALANCE,
  SAVE_DAI_BALANCE,
  SAVE_C_DAI_BALANCE,
  SAVE_COMPOUND_DAI_BALANCE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  balance: {
    wei: '',
    dai: '',
    cDai: '',
    compoundDai: '',
  }
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_C_DAI_BALANCE:
      return { balance: { ...state.balance, cDai: action.payload } };
    case SAVE_DAI_BALANCE:
      return { balance: { ...state.balance, dai: action.payload } };
    case SAVE_COMPOUND_DAI_BALANCE:
      return {
        balance: { ...state.balance, compoundDai: action.payload }
      };
    case SAVE_WEI_BALANCE:
      return { balance: { ...state.balance, wei: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;
