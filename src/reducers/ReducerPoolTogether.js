'use strict';
import {
  SAVE_POOLTOGETHER_DAI_INFO,
  TOGGLE_POOLTOGETHER_WINNER_REVEALED,
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  poolTogether: {
    dai: {
      totalBalance: '',
      openSupply: '',
      committedSupply: '',
      estimatedInterestRate: '',
      currentCommittedDrawId: '',
      lastWinner: '',
      winningAmount: '',
    },
    winnerRevealed: true,
  },
};

const poolTogether = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_POOLTOGETHER_DAI_INFO:
      return {
        poolTogether: {
          ...state.poolTogether,
          dai: {
            totalBalance: action.payload.pooltogether_accounted_balance,
            openSupply: action.payload.pooltogether_open_supply,
            committedSupply: action.payload.pooltogether_committed_supply,
            estimatedInterestRate:
              action.payload.pooltogether_estimated_interest_rate,
            currentCommittedDrawId:
              action.payload.pooltogether_committed_drawid,
            lastWinner: action.payload.pooltogether_rewarded,
            winningAmount: action.payload.pooltogether_winnings,
          },
        },
      };
    case TOGGLE_POOLTOGETHER_WINNER_REVEALED:
      return {
        poolTogether: {
          ...state.poolTogether,
          winnerRevealed: action.payload,
        },
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default poolTogether;
