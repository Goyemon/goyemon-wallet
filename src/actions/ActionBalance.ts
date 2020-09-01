'use strict';
import BigNumber from 'bignumber.js';
import {
  SAVE_WEI_BALANCE,
  SAVE_DAI_BALANCE,
  SAVE_C_DAI_BALANCE,
  SAVE_COMPOUND_DAI_BALANCE,
  SAVE_POOL_TOGETHER_DAI_BALANCE,
  MOVE_POOL_TOGETHER_DAI_BALANCE
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveWeiBalance(weiBalance: any) {
  return async function (dispatch: any) {
    try {
      LogUtilities.logInfo('weiBalance ==>', weiBalance);
      dispatch(saveWeiBalanceSuccess(weiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveWeiBalanceSuccess = (weiBalance: any) => ({
  type: SAVE_WEI_BALANCE,
  payload: weiBalance
});

export function saveCDaiBalance(cDaiBalance: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveCDaiBalanceSuccess(cDaiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCDaiBalanceSuccess = (cDaiBalance: any) => ({
  type: SAVE_C_DAI_BALANCE,
  payload: cDaiBalance
});

export function saveDaiBalance(daiBalance: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveDaiBalanceSuccess(daiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveDaiBalanceSuccess = (daiBalance: any) => ({
  type: SAVE_DAI_BALANCE,
  payload: daiBalance
});

export function saveCompoundDaiBalance(cDaiBalance: any, currentExchangeRate: any) {
  return async function (dispatch: any) {
    try {
      let compoundDaiBalance: BigNumber | string = new BigNumber(cDaiBalance).times(
        currentExchangeRate
      );
      compoundDaiBalance = compoundDaiBalance.toString();
      dispatch(saveCompoundDaiBalanceSuccess(compoundDaiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveCompoundDaiBalanceSuccess = (compoundDaiBalance: any) => ({
  type: SAVE_COMPOUND_DAI_BALANCE,
  payload: compoundDaiBalance
});

export function savePoolTogetherDaiBalance(daiBalance: any) {
  return async function (dispatch: any) {
    try {
      dispatch(savePoolTogetherDaiBalanceSuccess(daiBalance));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePoolTogetherDaiBalanceSuccess = (daiBalance: any) => ({
  type: SAVE_POOL_TOGETHER_DAI_BALANCE,
  payload: daiBalance
});

export function movePoolTogetherDaiBalance() {
  return async function (dispatch: any) {
    try {
      dispatch(movePoolTogetherDaiBalanceSuccess());
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const movePoolTogetherDaiBalanceSuccess = () => ({
  type: MOVE_POOL_TOGETHER_DAI_BALANCE
});
