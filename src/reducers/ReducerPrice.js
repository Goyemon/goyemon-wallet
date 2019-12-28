'use strict';
import { GET_DAI_PRICE, GET_ETH_PRICE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  price: {
    daiPrice: '',
    ethPrice: ''
  }
};

const price = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DAI_PRICE:
      return { price: { ...state.price, daiPrice: action.payload } };
    case GET_ETH_PRICE:
      return { price: { ...state.price, ethPrice: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default price;
