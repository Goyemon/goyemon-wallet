'use strict';
import { SAVE_NET_INFO } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities';

export function saveNetInfo(isOnline: boolean) {
  return async function (dispatch: any) {
    try {
      dispatch(saveNetInfoSuccess(isOnline));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveNetInfoSuccess = (isOnline: boolean) => ({
  type: SAVE_NET_INFO,
  payload: isOnline
});
