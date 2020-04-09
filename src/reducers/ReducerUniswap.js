'use strict';
import { SAVE_DAI_EXCHANGE_RESERVE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  uniswap: {
    daiExchange: {
      weiReserve: '',
      daiReserve: ''
    }
  }
};

const uniswap = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_EXCHANGE_RESERVE:
      return {
        uniswap: {
          daiExchange: {
            ...state.uniswap.daiExchange,
            weiReserve: action.payload.ETH_balance,
            daiReserve: action.payload.DAI_balance
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default uniswap;
