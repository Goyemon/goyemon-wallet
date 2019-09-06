'use strict';
import { GET_MNEMONIC } from '../constants/ActionTypes';
import WalletController from '../wallet-core/WalletController.ts';

export function getMnemonic() {
  return async function (dispatch) {
    try {
      const mnemonic = await WalletController.init();
      await WalletController.generateWallet(mnemonic);
      dispatch(getMnemonicSuccess(mnemonic));
    } catch(err) {
      console.error(err);
    }
  }
};

const getMnemonicSuccess = (mnemonic) => ({
  type: GET_MNEMONIC,
  payload: mnemonic
})
