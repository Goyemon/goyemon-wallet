'use strict';
import { SAVE_POOLTOGETHER_DAI_INFO } from '../constants/ActionTypes';

const INITIAL_STATE = {
  poolTogether: {
    dai: {
      estimatedPrize: '',
      ticketsSold: '',
      players: '',
      countdown: ''
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
            estimatedPrize: action.payload.estimatedPrize,
            ticketsSold: action.payload.tickets_sold,
            players: action.payload.players,
            countdown: action.payload.countdown
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default poolTogether;
