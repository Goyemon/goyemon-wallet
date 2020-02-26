'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';
import { SAVE_PHOTO_LIBRARY_PERMISSION } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveNotificationPermission(notificationPermission) {
  return async function (dispatch) {
    try {
      dispatch(saveNotificationPermissionSuccess(notificationPermission));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const saveNotificationPermissionSuccess = (notificationPermission) => ({
  type: SAVE_NOTIFICATION_PERMISSION,
  payload: notificationPermission
});

export function savePhotoLibraryPermission(photoLibraryPermission) {
  return async function (dispatch) {
    try {
      dispatch(savePhotoLibraryPermissionSuccess(photoLibraryPermission));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const savePhotoLibraryPermissionSuccess = (photoLibraryPermission) => ({
  type: SAVE_PHOTO_LIBRARY_PERMISSION,
  payload: photoLibraryPermission
});
