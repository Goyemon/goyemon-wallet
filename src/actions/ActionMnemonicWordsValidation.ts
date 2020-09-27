"use strict";
import { UPDATE_MNEMONIC_WORDS_VALIDATION } from "../constants/ActionTypes";

export const updateMnemonicWordsValidation = (validation: boolean) => (
  dispatch: any
) => {
  return dispatch({
    type: UPDATE_MNEMONIC_WORDS_VALIDATION,
    payload: validation
  });
};
