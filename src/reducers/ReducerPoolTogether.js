'use strict';
import {
  SAVE_POOLTOGETHER_DAI_INFO,
  SAVE_POOLTOGETHER_DAI_WINNER
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  poolTogether: {
    dai: {
      totalBalance: '',
      openSupply: '',
      committedSupply: '',
      estimatedInterestRate: '',
      winner: '',
      winningAmount: ''
    }
  }
};

const poolTogether = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_POOLTOGETHER_DAI_INFO:
      return {
        poolTogether: {
          dai: {
            ...state.poolTogether.dai,
            totalBalance: action.payload.pooltogether_accounted_balance,
            openSupply: action.payload.pooltogether_open_supply,
            committedSupply: action.payload.pooltogether_committed_supply,
            estimatedInterestRate:
              action.payload.pooltoogether_estimated_interest_rate
          }
        }
      };
    case SAVE_POOLTOGETHER_DAI_WINNER:
      return {
        poolTogether: {
          dai: {
            ...state.poolTogether.dai,
            winner: action.payload.winner,
            winningAmount: action.payload.amount
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default poolTogether;
