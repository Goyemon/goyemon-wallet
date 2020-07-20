'use strict';
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  mnemonicWordsValidation: false,
};

const mnemonicWordsValidation = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_MNEMONIC_WORDS_VALIDATION:
      return { ...state, mnemonicWordsValidation: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default mnemonicWordsValidation;
