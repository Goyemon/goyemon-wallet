'use strict';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import { saveNotificationPermission } from '../actions/ActionPermissions';
import { store } from '../store/store';
import LogUtilities from '../utilities/LogUtilities.js';

class FcmPermissions {
  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      LogUtilities.logInfo('user has permissions');
      store.dispatch(saveNotificationPermission(true));
    } else {
      LogUtilities.logInfo("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          store.dispatch(saveNotificationPermission(true));
          LogUtilities.logInfo('User has authorised');
        } else {
          store.dispatch(saveNotificationPermission(false));
        }
      } catch (error) {
        LogUtilities.logInfo('User has rejected permissions');
        store.dispatch(saveNotificationPermission(false));
      }
    }
  }
}

export default new FcmPermissions();
