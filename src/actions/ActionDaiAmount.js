'use strict';
import { SAVE_DAI_AMOUNT } from '../constants/ActionTypes';

export function saveDaiAmount(daiAmount) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiAmountSuccess(daiAmount));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveDaiAmountSuccess = (daiAmount) => ({
  type: SAVE_DAI_AMOUNT,
  payload: daiAmount
})
