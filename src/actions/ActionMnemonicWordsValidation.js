'use strict';
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function updateMnemonicWordsValidation(validation) {
  return async function (dispatch) {
    try {
      dispatch(updateMnemonicWordsValidationSuccess(validation));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const updateMnemonicWordsValidationSuccess = (validation) => ({
  type: UPDATE_MNEMONIC_WORDS_VALIDATION,
  payload: validation
});
