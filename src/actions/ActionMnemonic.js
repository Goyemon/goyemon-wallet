import { GENERATE_MNEMONIC } from '../constants/ActionTypes';
import '../../shim';
import WalletController from '../wallet-core/WalletController.ts';

export function getMnemonic() {
  return async function (dispatch) {
    try {
      await WalletController.init();
      const mnemonic = await WalletController.getMnemonic();
      dispatch(getMnemonicSuccess(mnemonic));
    } catch(err) {
      console.error(err);
    }
  }
};

const generateMnemonicSuccess = (mnemonic) => ({
  type: GENERATE_MNEMONIC,
  payload: mnemonic
})
