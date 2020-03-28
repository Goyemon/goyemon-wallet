'use strict';
import React from 'react';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { rehydrationComplete } from '../actions/ActionRehydration';
import '../firebase/FcmTokenMonitor';
import '../netinfo/NetInfoListener';
import SaveIcon from '../../assets/SaveIcon.js';
import HistoryIcon from '../../assets/HistoryIcon.js';
import WalletIcon from '../../assets/WalletIcon.js';
import BalanceStack from './BalanceStack';
import EarnStack from './EarnStack';
import SaveStack from './SaveStack';
import HistoryStack from './HistoryStack';
import SendStack from './SendStack';
import SwapStack from './SwapStack';
import { Loader } from '../components/common';
import { store, persistor } from '../store/store.js';

const AppTab = createBottomTabNavigator(
  {
    Balance: {
      screen: BalanceStack,
      navigationOptions: {
        tabBarLabel: 'Balance',
        tabBarIcon: ({ tintColor }) => <WalletIcon fill={tintColor} />
      }
    },
    Send: {
      screen: SendStack,
      navigationOptions: {
        tabBarLabel: 'Send',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="send" size={32} color={tintColor} />
        )
      }
    },
    Save: {
      screen: SaveStack,
      navigationOptions: {
        tabBarLabel: 'Save',
        tabBarIcon: ({ tintColor }) => <SaveIcon fill={tintColor} />
      }
    },
    Earn: {
      screen: EarnStack,
      navigationOptions: {
        tabBarLabel: 'Earn',
        tabBarIcon: ({ tintColor }) => <SaveIcon fill={tintColor} />
      }
    },
    Swap: {
      screen: SwapStack,
      navigationOptions: {
        tabBarLabel: 'Swap',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="swap-horizontal" size={32} color={tintColor} />
        )
      }
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ tintColor }) => <HistoryIcon fill={tintColor} />
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
    initialRouteName: 'Balance'
  }
);

const App = createAppContainer(AppTab);

export default () => (
  <Provider store={store}>
    <PersistGate
      loading={<Loader animating={true} size="large" />}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
);
