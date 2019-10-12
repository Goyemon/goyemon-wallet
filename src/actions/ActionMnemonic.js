'use strict';
import { SAVE_MNEMONIC } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveMnemonic() {
  return async function (dispatch) {
    try {
      const mnemonicWords = await WalletUtilities.getMnemonic();
      dispatch(saveMnemonicSuccess(mnemonicWords));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveMnemonicSuccess = (mnemonicWords) => ({
  type: SAVE_MNEMONIC,
  payload: mnemonicWords
})
