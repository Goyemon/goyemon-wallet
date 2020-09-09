"use strict";
import { SAVE_MNEMONIC } from "../constants/ActionTypes";

const INITIAL_STATE = {
  mnemonicWords: null
};

const mnemonicWords = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SAVE_MNEMONIC:
      return { ...state, mnemonicWords: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default mnemonicWords;
