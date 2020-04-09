'use strict';
import { SAVE_COMPOUND_DAI_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  compound: {
    dai: {
      currentExchangeRate: '',
      currentInterestRate: '',
      lifetimeEarned: '',  
    }
  },
};

const compound = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_COMPOUND_DAI_INFO:
      return {
        compound: {
          dai: {
            ...state.compound.dai,
            currentExchangeRate: action.payload.current_exchange_rate,
            currentInterestRate: action.payload.yearly_interest_rate,
            lifetimeEarned: action.payload.lifetime_earned,  
          }
        },
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default compound;
