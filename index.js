'use strict';
import './base64-polyfill';
import { AppRegistry } from 'react-native';
import App from './src/navigators/AppTab';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
