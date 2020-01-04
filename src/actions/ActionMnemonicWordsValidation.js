'use strict';
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from '../constants/ActionTypes';

export function updateMnemonicWordsValidation(validation) {
  return async function (dispatch) {
    try {
      dispatch(updateMnemonicWordsValidationSuccess(validation));
    } catch(err) {
      console.error(err);
    }
  }
};

const updateMnemonicWordsValidationSuccess = (validation) => ({
  type: UPDATE_MNEMONIC_WORDS_VALIDATION,
  payload: validation
})
