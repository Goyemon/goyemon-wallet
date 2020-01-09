'use strict';
import { SAVE_CDAI_LENDING_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  cDaiLendingInfo: {
    cDaiBalance: '',
    daiBalance: '',
    lifetimeEarned: '',
    currentRate: ''
  }
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_CDAI_LENDING_INFO:
      return {
        cDaiLendingInfo: {
          cDaiBalance: action.payload.cdai_balance,
          daiBalance: action.payload.dai_balance,
          lifetimeEarned: action.payload.lifetime_earned,
          currentRate: action.payload.current_rate
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;
