'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function saveNotificationPermission(notificationPermission) {
  return async function (dispatch) {
    try {
      dispatch(saveNotificationPermissionSuccess(notificationPermission));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveNotificationPermissionSuccess = (notificationPermission) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: notificationPermission
});
