'use strict';
import BigNumber from 'bignumber.js';
import {
  SAVE_C_DAI_BALANCE,
  SAVE_DAI_BALANCE,
  SAVE_COMPOUND_DAI_BALANCE,
  SAVE_WEI_BALANCE
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveCDaiBalance(cDaiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveCDaiBalanceSuccess(cDaiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCDaiBalanceSuccess = (cDaiBalance) => ({
  type: SAVE_C_DAI_BALANCE,
  payload: cDaiBalance
});

export function saveDaiBalance(daiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveDaiBalanceSuccess(daiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiBalanceSuccess = (daiBalance) => ({
  type: SAVE_DAI_BALANCE,
  payload: daiBalance
});

export function saveCompoundDaiBalance(cDaiBalance, currentExchangeRate) {
  return async function (dispatch) {
    try {
      let compoundDaiBalance = new BigNumber(cDaiBalance).times(
        currentExchangeRate
      );
      compoundDaiBalance = compoundDaiBalance.toString();
      dispatch(saveCompoundDaiBalanceSuccess(compoundDaiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCompoundDaiBalanceSuccess = (compoundDaiBalance) => ({
  type: SAVE_COMPOUND_DAI_BALANCE,
  payload: compoundDaiBalance
});

export function saveWeiBalance(weiBalance) {
  return async function (dispatch) {
    try {
      dispatch(saveWeiBalanceSuccess(weiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveWeiBalanceSuccess = (weiBalance) => ({
  type: SAVE_WEI_BALANCE,
  payload: weiBalance
});
