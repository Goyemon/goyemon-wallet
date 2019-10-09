'use strict';
import { SAVE_ETH_BALANCE } from '../constants/ActionTypes';
import { SAVE_DAI_BALANCE } from '../constants/ActionTypes';

export function saveEthBalance(ethBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveEthBalanceSuccess(ethBalance));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveEthBalanceSuccess = (ethBalance) => ({
  type: SAVE_ETH_BALANCE,
  payload: ethBalance
})

export function saveDaiBalance(daiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiBalanceSuccess(daiBalance));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveDaiBalanceSuccess = (daiBalance) => ({
  type: SAVE_DAI_BALANCE,
  payload: daiBalance
})
