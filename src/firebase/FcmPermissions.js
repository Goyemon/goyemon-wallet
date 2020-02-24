'use strict';
import firebase from 'react-native-firebase';
import { saveNotificationPermission } from '../actions/ActionPermissions';
import { store } from '../store/store';
import DebugUtilities from '../utilities/DebugUtilities.js';

class FcmPermissions {
  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      DebugUtilities.logInfo('user has permissions');
      store.dispatch(saveNotificationPermission(true));
    } else {
      DebugUtilities.logInfo("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          store.dispatch(saveNotificationPermission(true));
          DebugUtilities.logInfo('User has authorised');
        } else {
          store.dispatch(saveNotificationPermission(false));
        }
      } catch (error) {
        DebugUtilities.logInfo('User has rejected permissions');
        store.dispatch(saveNotificationPermission(false));
      }
    }
  }
}

export default new FcmPermissions();
