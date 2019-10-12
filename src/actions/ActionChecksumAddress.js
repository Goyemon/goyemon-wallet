'use strict';
import { CREATE_CHECKSUM_ADDRESS } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function createChecksumAddress() {
  return async function (dispatch) {
    try {
      const checksumAddress = await WalletUtilities.createChecksumAddress();
      dispatch(createChecksumAddressSuccess(checksumAddress));
    } catch(err) {
      console.error(err);
    }
  }
};

const createChecksumAddressSuccess = (checksumAddress) => ({
  type: CREATE_CHECKSUM_ADDRESS,
  payload: checksumAddress
})
