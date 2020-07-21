'use strict';
import React from 'react';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { PersistGate } from 'redux-persist/integration/react';
import { rehydrationComplete } from '../actions/ActionRehydration';
import '../firebase/FcmTokenMonitor';
import I18n from '../i18n/I18n';
import '../netinfo/NetInfoListener';
import PortfolioStack from './PortfolioStack';
import EarnStack from './EarnStack';
import HistoryStack from './HistoryStack';
import SendStack from './SendStack';
import SwapStack from './SwapStack';
import { Loader } from '../components/common';
import { store, persistor } from '../store/store.js';

const AppTab = createBottomTabNavigator(
  {
    Portfolio: {
      screen: PortfolioStack,
      navigationOptions: {
        tabBarLabel: I18n.t('portfolio'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="chart-pie" size={30} color={tintColor} />
        )
      }
    },
    Send: {
      screen: SendStack,
      navigationOptions: {
        tabBarLabel: I18n.t('send'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="send" size={30} color={tintColor} />
        )
      }
    },
    Earn: {
      screen: EarnStack,
      navigationOptions: {
        tabBarLabel: I18n.t('earn'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="signal-cellular-3" size={30} color={tintColor} />
        )
      }
    },
    Swap: {
      screen: SwapStack,
      navigationOptions: {
        tabBarLabel: I18n.t('swap'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="swap-horizontal" size={30} color={tintColor} />
        )
      }
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel: I18n.t('history'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="script-text-outline" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#00A3E2',
      style: {
        height: 56
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
    initialRouteName: 'Portfolio'
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
