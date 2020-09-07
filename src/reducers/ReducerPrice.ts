"use strict";
import {
  GET_DAI_PRICE,
  GET_ETH_PRICE,
  GET_CDAI_PRICE
} from "../constants/ActionTypes";

const INITIAL_STATE = {
  price: {
    dai: "",
    eth: "",
    cdai: ""
  }
};

const price = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case GET_DAI_PRICE:
      return { price: { ...state.price, dai: action.payload } };
    case GET_ETH_PRICE:
      return { price: { ...state.price, eth: action.payload } };
    case GET_CDAI_PRICE: {
      return { price: { ...state.price, cdai: action.payload } };
    }
    default:
      return state || INITIAL_STATE;
  }
};

export default price;
