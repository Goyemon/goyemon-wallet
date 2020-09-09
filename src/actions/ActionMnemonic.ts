"use strict";
import { SAVE_MNEMONIC } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";
import WalletUtilities from "../utilities/WalletUtilities";

export function saveMnemonicWords() {
  return async function (dispatch: any) {
    try {
      const mnemonicWords = await WalletUtilities.getMnemonic();
      dispatch(saveMnemonicWordsSuccess(mnemonicWords));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveMnemonicWordsSuccess = (mnemonicWords: any) => ({
  type: SAVE_MNEMONIC,
  payload: mnemonicWords
});
