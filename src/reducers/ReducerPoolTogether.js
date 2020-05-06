'use strict';
import { SAVE_POOLTOGETHER_DAI_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  poolTogether: {
    dai: {
      totalBalance: '',
      openSupply: '',
      committedSupply: '',
      estimatedInterestRate: '',
      committedDrawId: '',
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
              action.payload.pooltogether_estimated_interest_rate,
            committedDrawId: action.payload.pooltogether_committed_drawid

          }
        }
      };
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default poolTogether;
