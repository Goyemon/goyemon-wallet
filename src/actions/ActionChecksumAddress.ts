"use strict";
import { CREATE_CHECKSUM_ADDRESS } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";
import WalletUtilities from "../utilities/WalletUtilities";

export function createChecksumAddress() {
  return async function (dispatch: any) {
    try {
      const checksumAddress = await WalletUtilities.createChecksumAddress();
      dispatch(createChecksumAddressSuccess(checksumAddress));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const createChecksumAddressSuccess = (checksumAddress: any) => ({
  type: CREATE_CHECKSUM_ADDRESS,
  payload: checksumAddress
});
