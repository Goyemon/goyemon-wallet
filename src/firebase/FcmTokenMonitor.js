'use strict';
import firebase from 'react-native-firebase';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import { store } from '../store/store';
import LogUtilities from '../utilities/LogUtilities.js';

firebase.messaging().onTokenRefresh(fcmToken => {
  LogUtilities.logInfo('a new fcmToken is generated ===>', fcmToken);
  store.dispatch(saveFcmToken(fcmToken));
  // TODO: if this happens we definitely need to let the server know, preferably with old token too.
});
