'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveNotificationPermission(notificationPermission: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveNotificationPermissionSuccess(notificationPermission));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveNotificationPermissionSuccess = (notificationPermission: any) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: notificationPermission
});
