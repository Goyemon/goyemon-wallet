'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';

export function saveNotificationPermission(permission) {
  return async function (dispatch) {
    try {
      dispatch(saveNotificationPermissionSuccess(permission));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveNotificationPermissionSuccess = (permission) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: permission
})
