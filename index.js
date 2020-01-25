'use strict';
import './shim';
import './base64-polyfill';
import { YellowBox } from 'react-native';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/navigators/AppTab';
import { name as appName } from './app.json';
import FcmBackgroundListener from './src/firebase/FcmBackgroundListener';

YellowBox.ignoreWarnings(['Remote debugger']);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => FcmBackgroundListener);
