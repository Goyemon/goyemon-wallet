'use strict';
import { GET_ETH_PRICE, GET_DAI_PRICE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  price: {
    ethPrice: '0',
    daiPrice: '0'
  }
};

const price = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ETH_PRICE:
      return { price: { ...state.price, ethPrice: action.payload } };
    case GET_DAI_PRICE:
      return { price: { ...state.price, daiPrice: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default price;
