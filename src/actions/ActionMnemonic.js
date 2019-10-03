'use strict';
import { SAVE_MNEMONIC } from '../constants/ActionTypes';
import WalletController from '../wallet-core/WalletController.ts';

export function saveMnemonic() {
  return async function (dispatch) {
    try {
      const mnemonic = await WalletController.init();
      await WalletController.generateWallet(mnemonic);
      dispatch(saveMnemonicSuccess(mnemonic));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveMnemonicSuccess = (mnemonicWords) => ({
  type: SAVE_MNEMONIC,
  payload: mnemonicWords
})
