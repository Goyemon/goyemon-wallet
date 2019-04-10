'use strict';
import { GET_MNEMONIC } from "../constants/ActionTypes";

const INITIAL_STATE = {
  mnemonic: ""
};

const mnemonic = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MNEMONIC:
      return { ...state, mnemonic: action.payload };
    default:
      return state || INITIAL_STATE;
  };
};

export default mnemonic;
