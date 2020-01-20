'use strict';
import { SAVE_CDAI_LENDING_INFO, SAVE_DAI_APPROVAL_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  cDaiLendingInfo: {
    daiApproval: null,
    currentExchangeRate: '',
    currentInterestRate: '',
    lifetimeEarned: ''
  }
};

const cDaiLendingInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_CDAI_LENDING_INFO:
      return {
        cDaiLendingInfo: {
          currentExchangeRate: action.payload.current_exchange_rate,
          currentInterestRate: action.payload.yearly_interest_rate,
          lifetimeEarned: action.payload.lifetime_earned
        }
      };
    case SAVE_DAI_APPROVAL_INFO:
      return {
        cDaiLendingInfo: {
          daiApproval: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default cDaiLendingInfo;
