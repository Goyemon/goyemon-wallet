'use strict';
import { CREATE_CHECKSUM_ADDRESS } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function createChecksumAddress() {
  return async function (dispatch) {
    try {
      const checksumAddress = await WalletUtilities.createChecksumAddress();
      dispatch(createChecksumAddressSuccess(checksumAddress));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const createChecksumAddressSuccess = (checksumAddress) => ({
  type: CREATE_CHECKSUM_ADDRESS,
  payload: checksumAddress
});
