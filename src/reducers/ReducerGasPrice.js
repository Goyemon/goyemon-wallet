'use strict';
import { GET_GAS_PRICE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  gasPrice: {}
};

const gasPrice = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GAS_PRICE:
      return { ...state, gasPrice: action.payload };
    default:
      return state || INITIAL_STATE;
  };
};

export default gasPrice;
