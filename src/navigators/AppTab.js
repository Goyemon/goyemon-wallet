'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import rootReducers from '../reducers/ReducerIndex';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['ReducerOutgoingTransactionObject', 'ReducerTransactionHistory']
}

const persistedReducer = persistReducer(persistConfig, rootReducers);

let store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

const AppTab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => <Icon name="ios-home" size={32} color={tintColor} />
      }
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon name="ios-settings" size={32} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#e91e63',
      tabStyle: {
        marginTop: 16
      }
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(AppTab);

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
