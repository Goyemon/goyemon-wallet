'use strict';
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function updateMnemonicWordsValidation(validation: any) {
  return async function (dispatch: any) {
    try {
      dispatch(updateMnemonicWordsValidationSuccess(validation));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateMnemonicWordsValidationSuccess = (validation: any) => ({
  type: UPDATE_MNEMONIC_WORDS_VALIDATION,
  payload: validation
});
