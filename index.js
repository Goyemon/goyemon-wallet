'use strict';
import './shim';
import './base64-polyfill';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/navigators/AppTab';
import { name as appName } from './app.json';
import { firebaseListener } from './src/firebase/FirebaseListener';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseListener);
