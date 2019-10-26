'use strict';
import { SAVE_DAI_TO_ADDRESS } from '../constants/ActionTypes';

export function saveDaiToAddress(daiToAddress) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiToAddressSuccess(daiToAddress));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveDaiToAddressSuccess = (daiToAddress) => ({
  type: SAVE_DAI_TO_ADDRESS,
  payload: daiToAddress
})
