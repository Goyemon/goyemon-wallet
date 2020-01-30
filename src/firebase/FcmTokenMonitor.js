'use strict';
import firebase from 'react-native-firebase';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import { store } from '../store/store';
import WalletUtilities from '../utilities/WalletUtilities.ts';

firebase.messaging().onTokenRefresh(fcmToken => {
  WalletUtilities.logInfo('a new fcmToken is generated ===>', fcmToken);
  store.dispatch(saveFcmToken(fcmToken));
});

firebase
  .messaging()
  .getToken()
  .then(fcmToken => {
    if (fcmToken) {
      WalletUtilities.logInfo('the current fcmToken ===>', fcmToken);
      store.dispatch(saveFcmToken(fcmToken));
    } else {
      WalletUtilities.logInfo('no fcmToken ');
    }
  });
