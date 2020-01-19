'use strict';
import { SAVE_DAI_BALANCE, SAVE_ETH_BALANCE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  balance: {
    cDaiBalance: '',
    daiBalance: '',
    ethBalance: '',
    daiSavingsBalance: '',
  }
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_C_DAI_BALANCE:
      return { balance: { ...state.balance, cDaiBalance: action.payload } };
    case SAVE_DAI_BALANCE:
      return { balance: { ...state.balance, daiBalance: action.payload } };
    case SAVE_ETH_BALANCE:
      return { balance: { ...state.balance, ethBalance: action.payload } };
    case SAVE_DAI_SAVINGS_BALANCE:
      return { balance: { ...state.balance, daiSavingsBalance: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;
