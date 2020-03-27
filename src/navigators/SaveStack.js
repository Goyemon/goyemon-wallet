'use strict';
import { createStackNavigator } from 'react-navigation';
import SaveDai from '../containers/SaveDai';
import DepositDai from '../containers/DepositDai';
import DepositDaiConfirmation from '../containers/DepositDaiConfirmation';
import WithdrawDai from '../containers/WithdrawDai';
import WithdrawDaiConfirmation from '../containers/WithdrawDaiConfirmation';

const SaveStack = createStackNavigator(
  {
    SaveDai: {
      screen: SaveDai,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    DepositDai: {
      screen: DepositDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositDaiConfirmation: {
      screen: DepositDaiConfirmation,
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
    initialRouteName: 'SaveDai'
  }
);

export default SaveStack;
