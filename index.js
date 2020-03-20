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
import FcmBackgroundListener from './src/firebase/FcmBackgroundListener';
import { store } from './src/store/store';

YellowBox.ignoreWarnings(['Remote debugger']);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => FcmBackgroundListener
);

persistStore(store, {}, () => {
  store.dispatch(rehydrationComplete(true));
  FcmListener.registerHandler();
});
