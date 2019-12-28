'use strict';
import React from 'react';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import '../firebase/FirebaseListener';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import { store, persistor } from '../store/store.js';

const AppTab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Wallets',
        tabBarIcon: ({ tintColor }) => <Icon name="wallet" size={28} color={tintColor} />
      }
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon name="setting" size={28} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#00A3E2',
      style: {
        height: 60,
        marginTop: 8
      },
      labelStyle: {
        fontSize: 12,
        fontFamily: 'HKGrotesk-Bold',
        marginBottom: 0
      },
      tabStyle: {
        marginTop: 8
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
