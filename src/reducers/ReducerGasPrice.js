'use strict';
import {
  GET_GAS_PRICE_FAST,
  GET_GAS_PRICE_AVERAGE,
  GET_GAS_PRICE_SLOW
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  gasPrice: {
    fast: '0',
    average: '0',
    slow: '0'
  }
};

const gasPrice = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GAS_PRICE_FAST:
      return { gasPrice: { ...state.gasPrice, fast: action.payload } };
    case GET_GAS_PRICE_AVERAGE:
      return { gasPrice: { ...state.gasPrice, average: action.payload } };
    case GET_GAS_PRICE_SLOW:
      return { gasPrice: { ...state.gasPrice, slow: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default gasPrice;
