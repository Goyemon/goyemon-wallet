'use strict';
import { GET_CHECKSUM_ADDRESS } from '../constants/ActionTypes';
import '../../shim';
import WalletController from '../wallet-core/WalletController.ts';

export function getChecksumAddress() {
  return async function (dispatch) {
    try {
      const wallet = await WalletController.createWallet();
      const checksumAddress = await WalletController.createChecksumAddress(wallet);
      dispatch(getChecksumAddressSuccess(checksumAddress));
    } catch(err) {
      console.error(err);
    }
  }
};

const getChecksumAddressSuccess = (checksumAddress) => ({
  type: GET_CHECKSUM_ADDRESS,
  payload: checksumAddress
})
