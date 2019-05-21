'use strict';
import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import rootReducers from '../reducers/ReducerIndex';

const store = createStore(rootReducers, applyMiddleware(thunk));
const AppTab = createBottomTabNavigator(
  {
    Home: HomeStack,
    Settings: SettingsStack
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppTab);

export default () => (
  <Provider store={store}>
      <App />
  </Provider>
);
