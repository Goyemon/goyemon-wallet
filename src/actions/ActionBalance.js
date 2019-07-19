'use strict';
import { SAVE_BALANCE } from '../constants/ActionTypes';

export function saveBalance(balance) {
  return async function (dispatch) {
    try {
      dispatch(saveBalanceSuccess(balance));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveBalanceSuccess = (balance) => ({
  type: SAVE_BALANCE,
  payload: balance
})
