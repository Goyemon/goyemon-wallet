'use strict';
import './shim';
import './base64-polyfill';
import { YellowBox } from 'react-native';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import { rehydrationComplete } from './src/actions/ActionRehydration';
import App from './src/navigators/AppTab';
import { name as appName } from './app.json';
import FcmListener from './src/firebase/FcmListener';
import FCM from './src/lib/fcm';
import FcmBackgroundListener from './src/firebase/FcmBackgroundListener';
import { store } from './src/store/store';
import TxStorage from './src/lib/tx';

YellowBox.ignoreWarnings(['Remote debugger']);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => FcmBackgroundListener
);

FCM.FCMMsgs.setMsgCallback(FcmListener.downstreamMessageHandler); // so now FcmListener is just a callback we attach to FCMMsgs.
FcmListener.setStoreReadyPromise(
  new Promise((resolve, reject) => {
    persistStore(store, {}, () => {
      TxStorage.storage.isStorageReady().then(() => {
        store.dispatch(rehydrationComplete(true));
        resolve();
      });
    });
  })
);
FCM.registerHandler(); // Then we call FCM.registerHandler() to actually initialize FCM.
