'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store.js';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';

const AppTab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => <Icon name="home" size={32} color={tintColor} />
      }
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon name="setting" size={32} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#009DC4',
      tabStyle: {
        height: 48,
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
