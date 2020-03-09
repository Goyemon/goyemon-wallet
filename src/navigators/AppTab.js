'use strict';
import React from 'react';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { rehydrationComplete } from '../actions/ActionRehydration';
import FcmListener from '../firebase/FcmListener';
import '../firebase/FcmTokenMonitor';
import '../netinfo/NetInfoListener';
import SaveIcon from '../../assets/SaveIcon.js';
import HistoryIcon from '../../assets/HistoryIcon.js';
import WalletIcon from '../../assets/WalletIcon.js';
import SaveStack from './SaveStack';
import HistoryStack from './HistoryStack';
import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import SwapStack from './SwapStack';
import { store, persistor } from '../store/store.js';

const AppTab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Wallets',
        tabBarIcon: ({ tintColor }) => <WalletIcon fill={tintColor} />
      }
    },
    Swap: {
      screen: SwapStack,
      navigationOptions: {
        tabBarLabel: 'Swap',
        tabBarIcon: ({ tintColor }) => <Icon name="swap" size={28} color={tintColor} />
      }
    },
    Save: {
      screen: SaveStack,
      navigationOptions: {
        tabBarLabel: 'Save',
        tabBarIcon: ({ tintColor }) => <SaveIcon fill={tintColor} />
      }
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ tintColor }) => <HistoryIcon fill={tintColor} />
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
FcmListener.registerHandler();

persistStore(store, {}, () => {
  store.dispatch(rehydrationComplete(true));
});

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
