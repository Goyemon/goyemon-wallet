'use strict';
import firebase from 'react-native-firebase';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import { store } from '../store/store';
import DebugUtilities from '../utilities/DebugUtilities.js';

firebase.messaging().onTokenRefresh(fcmToken => {
  DebugUtilities.logInfo('a new fcmToken is generated ===>', fcmToken);
  store.dispatch(saveFcmToken(fcmToken));
});

firebase
  .messaging()
  .getToken()
  .then(fcmToken => {
    if (fcmToken) {
      DebugUtilities.logInfo('the current fcmToken ===>', fcmToken);
      store.dispatch(saveFcmToken(fcmToken));
    } else {
      DebugUtilities.logInfo('no fcmToken ');
    }
  });
