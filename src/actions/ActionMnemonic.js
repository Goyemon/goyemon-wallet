'use strict';
import { SAVE_MNEMONIC } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveMnemonicWords() {
  return async function (dispatch) {
    try {
      const mnemonicWords = await WalletUtilities.getMnemonic();
      dispatch(saveMnemonicWordsSuccess(mnemonicWords));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveMnemonicWordsSuccess = (mnemonicWords) => ({
  type: SAVE_MNEMONIC,
  payload: mnemonicWords
});
