'use strict';
import { SAVE_DAI_BALANCE, SAVE_ETH_BALANCE } from '../constants/ActionTypes';
export function saveCDaiBalance(cDaiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiBalanceSuccess(cDaiBalance));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveCDaiBalanceSuccess = (cDaiBalance) => ({
  type: SAVE_C_DAI_BALANCE,
  payload: cDaiBalance
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
