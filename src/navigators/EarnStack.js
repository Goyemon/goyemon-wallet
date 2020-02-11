'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnDai from '../containers/EarnDai';
import EarnList from '../containers/EarnList';
import DepositDai from '../containers/DepositDai';
import SupplyDaiConfirmation from '../containers/SupplyDaiConfirmation';
import WithdrawDai from '../containers/WithdrawDai';
import WithdrawDaiConfirmation from '../containers/WithdrawDaiConfirmation';

const EarnStack = createStackNavigator(
  {
    EarnDai: {
      screen: EarnDai,
      navigationOptions: () => ({
        headerTransparent: true,
      })
    },
    EarnList: {
      screen: EarnList,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Earn'
      })
    },
    DepositDai: {
      screen: DepositDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Supply'
      })
    },
    SupplyDaiConfirmation: {
      screen: SupplyDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    WithdrawDai: {
      screen: WithdrawDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Withdraw'
      })
    },
    WithdrawDaiConfirmation: {
      screen: WithdrawDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'EarnList'
  }
);

export default EarnStack;
