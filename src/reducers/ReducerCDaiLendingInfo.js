'use strict';
import { SAVE_CDAI_LENDING_INFO, SAVE_DAI_APPROVAL_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  cDaiLendingInfo: {
    daiSavingsBalance: '',
    lifetimeEarned: '',
    currentRate: ''
    daiApproval: null,
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
