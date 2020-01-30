'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';
import WalletUtilities from '../utilities/WalletUtilities.ts';

export function saveNotificationPermission(notificationPermission) {
  return async function (dispatch) {
    try {
      dispatch(saveNotificationPermissionSuccess(notificationPermission));
    } catch(err) {
      WalletUtilities.logError(err);
    }
  }
};

const saveNotificationPermissionSuccess = (notificationPermission) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: notificationPermission
});
