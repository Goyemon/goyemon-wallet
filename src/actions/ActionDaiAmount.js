'use strict';
import { SAVE_DAI_AMOUNT } from '../constants/ActionTypes';

export function saveOutgoingDaiTransactionAmount(daiAmount) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingDaiTransactionAmountSuccess(daiAmount));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOutgoingDaiTransactionAmountSuccess = (daiAmount) => ({
  type: SAVE_DAI_AMOUNT,
  payload: daiAmount
})
