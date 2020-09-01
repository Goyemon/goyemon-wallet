'use strict';
import {
  SAVE_POOLTOGETHER_DAI_INFO,
  TOGGLE_POOLTOGETHER_WINNER_REVEALED
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function savePoolTogetherDaiInfo(poolTogetherDaiInfo: any) {
  return async function (dispatch: any) {
    try {
      dispatch(savePoolTogetherDaiInfoSuccess(poolTogetherDaiInfo));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePoolTogetherDaiInfoSuccess = (poolTogetherDaiInfo: any) => ({
  type: SAVE_POOLTOGETHER_DAI_INFO,
  payload: poolTogetherDaiInfo
});

export function togglePoolTogetherWinnerRevealed(revealed: any) {
  return async function (dispatch: any) {
    try {
      dispatch(togglePoolTogetherWinnerRevealedSuccess(revealed));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const togglePoolTogetherWinnerRevealedSuccess = (revealed: any) => ({
  type: TOGGLE_POOLTOGETHER_WINNER_REVEALED,
  payload: revealed
});
