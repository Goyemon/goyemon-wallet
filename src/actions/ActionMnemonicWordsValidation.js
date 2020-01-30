'use strict';
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function updateMnemonicWordsValidation(validation) {
  return async function (dispatch) {
    try {
      dispatch(updateMnemonicWordsValidationSuccess(validation));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const updateMnemonicWordsValidationSuccess = (validation) => ({
  type: UPDATE_MNEMONIC_WORDS_VALIDATION,
  payload: validation
});
