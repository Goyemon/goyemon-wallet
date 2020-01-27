'use strict';
import firebase from 'react-native-firebase';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import { store } from '../store/store';

firebase.messaging().onTokenRefresh(fcmToken => {
  console.log('a new fcmToken is generated ===>', fcmToken);
  store.dispatch(saveFcmToken(fcmToken));
});

firebase
  .messaging()
  .getToken()
  .then(fcmToken => {
    if (fcmToken) {
      console.log('the current fcmToken ===>', fcmToken);
      store.dispatch(saveFcmToken(fcmToken));
    } else {
      console.log('no fcmToken ');
    }
  });
