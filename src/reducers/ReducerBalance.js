'use strict';
import { SAVE_DAI_BALANCE, SAVE_ETH_BALANCE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  balance: {
    daiBalance: '',
    ethBalance: '',
    cDaiBalance: ''
  }
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_BALANCE:
      return { balance: { ...state.balance, daiBalance: action.payload } };
    case SAVE_ETH_BALANCE:
      return { balance: { ...state.balance, ethBalance: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;
