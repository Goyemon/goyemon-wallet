'use strict';
import { SAVE_CDAI_LENDING_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  cDaiLendingInfo: {
    daiSavingsBalance: '',
    lifetimeEarned: '',
    currentRate: ''
  }
};

const cDaiLendingInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_CDAI_LENDING_INFO:
      return {
        cDaiLendingInfo: {
          daiSavingsBalance: action.payload.dai_balance,
          lifetimeEarned: action.payload.lifetime_earned,
          currentRate: action.payload.yearly_interest_rate
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default cDaiLendingInfo;
