'use strict';
import {
  SAVE_POOLTOGETHER_DAI_INFO,
  TOGGLE_POOLTOGETHER_WINNER_REVEALED
} from '../constants/ActionTypes';
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

export function togglePoolTogetherWinnerRevealed(revealed) {
  return async function (dispatch) {
    try {
      dispatch(togglePoolTogetherWinnerRevealedSuccess(revealed));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const togglePoolTogetherWinnerRevealedSuccess = (revealed) => ({
  type: TOGGLE_POOLTOGETHER_WINNER_REVEALED,
  payload: revealed
});
