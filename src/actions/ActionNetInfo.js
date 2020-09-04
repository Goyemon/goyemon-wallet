"use strict";
import { SAVE_NET_INFO } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function saveNetInfo(isOnline) {
  return async function (dispatch) {
    try {
      dispatch(saveNetInfoSuccess(isOnline));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveNetInfoSuccess = (isOnline) => ({
  type: SAVE_NET_INFO,
  payload: isOnline
});
