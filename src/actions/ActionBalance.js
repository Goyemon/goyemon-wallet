'use strict';
import BigNumber from "bignumber.js"
import { SAVE_C_DAI_BALANCE, SAVE_DAI_BALANCE, SAVE_DAI_SAVINGS_BALANCE, SAVE_WEI_BALANCE } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveCDaiBalance(cDaiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiBalanceSuccess(cDaiBalance));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveCDaiBalanceSuccess = (cDaiBalance) => ({
  type: SAVE_C_DAI_BALANCE,
  payload: cDaiBalance
});

export function saveDaiBalance(daiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiBalanceSuccess(daiBalance));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveDaiBalanceSuccess = (daiBalance) => ({
  type: SAVE_DAI_BALANCE,
  payload: daiBalance
});

export function saveDaiSavingsBalance(cDaiBalance, currentExchangeRate) {
  return async function (dispatch) {
    try {
      const daiSavingsBalance = new BigNumber(cDaiBalance).times(currentExchangeRate);
      dispatch(saveDaiSavingsBalanceSuccess(daiSavingsBalance));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveDaiSavingsBalanceSuccess = (daiSavingsBalance) => ({
  type: SAVE_DAI_SAVINGS_BALANCE,
  payload: daiSavingsBalance
});

export function saveWeiBalance(weiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveWeiBalanceSuccess(weiBalance));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveWeiBalanceSuccess = (weiBalance) => ({
  type: SAVE_WEI_BALANCE,
  payload: weiBalance
});
