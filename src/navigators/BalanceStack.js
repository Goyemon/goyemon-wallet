'use strict';
import { createStackNavigator } from 'react-navigation';
import BalanceHome from '../containers/BalanceHome';
import Receive from '../containers/Receive';
import BalanceWallet from '../containers/BalanceWallet';
import BalanceCompound from '../containers/BalanceCompound';

const BalanceStack = createStackNavigator(
  {
    BalanceHome: {
      screen: BalanceHome,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    BalanceWallet: {
      screen: BalanceWallet,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    BalanceCompound: {
      screen: BalanceCompound,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'BalanceHome'
  }
);

export default BalanceStack;
