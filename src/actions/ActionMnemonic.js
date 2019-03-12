import { GENERATE_MNEMONIC } from '../constants/ActionTypes';
import '../../shim';
import bip39 from 'react-native-bip39';

export function generateMnemonic() {
  return async function (dispatch) {
    try {
      const mnemonic = await bip39.generateMnemonic();
      dispatch(generateMnemonicSuccess(mnemonic));
    } catch(err) {
      console.error(err);
    }
  }
};

const generateMnemonicSuccess = (mnemonic) => ({
  type: GENERATE_MNEMONIC,
  payload: mnemonic
})
