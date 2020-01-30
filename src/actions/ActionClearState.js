'use strict';
import { CLEAR_STATE } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function clearState() {
  return async function (dispatch) {
    try {
      dispatch(clearStateSuccess());
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const clearStateSuccess = () => ({
  type: CLEAR_STATE
});
