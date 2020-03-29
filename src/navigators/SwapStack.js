'use strict';
import { createStackNavigator } from 'react-navigation';
import Swap from '../containers/Swap';
import SwapConfirmation from '../containers/SwapConfirmation';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

const SwapStack = createStackNavigator(
  {
    Swap: {
      screen: Swap,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Swap'
      })
    },
    SwapConfirmation: {
      screen: SwapConfirmation,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SwapConfirmation'
      })
    },
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: { marginTop: 18 }
      })
    },
    BackupWords: {
      screen: BackupWords,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Advanced: {
      screen: Advanced,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'Swap'
  }
);

export default SwapStack;
