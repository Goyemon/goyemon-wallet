'use strict';
import firebase from 'react-native-firebase';
import { saveNotificationPermission } from '../actions/ActionNotificationPermission';
import { store } from '../store/store';

class FcmPermissions {
  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('user has permissions');
      store.dispatch(saveNotificationPermission(true));
    } else {
      console.log("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          store.dispatch(saveNotificationPermission(true));
          console.log('User has authorised');
        } else {
          store.dispatch(saveNotificationPermission(false));
        }
      } catch (error) {
        console.log('User has rejected permissions');
        store.dispatch(saveNotificationPermission(false));
      }
    }
  }
}

export default new FcmPermissions();
