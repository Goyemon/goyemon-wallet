'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';

export function saveNotificationPermission(notificationPermission) {
  return async function (dispatch) {
    try {
      dispatch(saveNotificationPermissionSuccess(notificationPermission));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveNotificationPermissionSuccess = (notificationPermission) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: notificationPermission
})
