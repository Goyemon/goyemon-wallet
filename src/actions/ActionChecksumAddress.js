'use strict';
import { CREATE_CHECKSUM_ADDRESS } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function createChecksumAddress() {
  return async function (dispatch) {
    try {
      const checksumAddress = await WalletUtilities.createChecksumAddress();
      dispatch(createChecksumAddressSuccess(checksumAddress));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const createChecksumAddressSuccess = (checksumAddress) => ({
  type: CREATE_CHECKSUM_ADDRESS,
  payload: checksumAddress
});
