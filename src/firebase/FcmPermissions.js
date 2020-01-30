'use strict';
import firebase from 'react-native-firebase';
import { saveNotificationPermission } from '../actions/ActionNotificationPermission';
import { store } from '../store/store';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class FcmPermissions {
  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      WalletUtilities.logInfo('user has permissions');
      store.dispatch(saveNotificationPermission(true));
    } else {
      WalletUtilities.logInfo("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          store.dispatch(saveNotificationPermission(true));
          WalletUtilities.logInfo('User has authorised');
        } else {
          store.dispatch(saveNotificationPermission(false));
        }
      } catch (error) {
        WalletUtilities.logInfo('User has rejected permissions');
        store.dispatch(saveNotificationPermission(false));
      }
    }
  }
}

export default new FcmPermissions();
