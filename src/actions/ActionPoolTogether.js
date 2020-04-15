'use strict';
import { SAVE_POOLTOGETHER_DAI_INFO } from '../constants/ActionTypes';
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
