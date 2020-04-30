'use strict';
import { SAVE_POOLTOGETHER_DAI_INFO, SAVE_POOLTOGETHER_DAI_WINNER } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function savePoolTogetherDaiInfo(poolTogetherDaiInfo) {
  return async function (dispatch) {
    try {
      dispatch(savePoolTogetherDaiInfoSuccess(poolTogetherDaiInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePoolTogetherDaiInfoSuccess = (poolTogetherDaiInfo) => ({
  type: SAVE_POOLTOGETHER_DAI_INFO,
  payload: poolTogetherDaiInfo
});

export function savePoolTogetherDaiWinner(poolTogetherDaiWinner) {
  return async function (dispatch) {
    try {
      dispatch(savePoolTogetherDaiWinnerSuccess(poolTogetherDaiWinner));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePoolTogetherDaiWinnerSuccess = (poolTogetherDaiWinner) => ({
  type: SAVE_POOLTOGETHER_DAI_INFO,
  payload: poolTogetherDaiWinner
});
