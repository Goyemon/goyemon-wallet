'use strict';
import { SAVE_DAI_EXCHANGE_RESERVE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  exchangeReserve: {
    daiExchange: {
      weiReserve: '',
      daiReserve: ''
    }
  }
};

const exchangeReserve = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_EXCHANGE_RESERVE:
      return {
        exchangeReserve: {
          daiExchange: {
            ...state.exchangeReserve.daiExchange,
            weiReserve: action.payload.ETH_balance,
            daiReserve: action.payload.DAI_balance
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default exchangeReserve;
