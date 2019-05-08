'use strict';
import { SAVE_WEB3 } from '../constants/ActionTypes';
import ProviderController from '../wallet-core/ProviderController.ts';

export function saveWeb3() {
  return async function (dispatch) {
    try {
      dispatch(saveWeb3Success(ProviderController.setProvider()));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveWeb3Success = (web3) => ({
  type: SAVE_WEB3,
  payload: web3
})
