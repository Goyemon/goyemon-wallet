'use strict';
import { createStackNavigator } from 'react-navigation';
import SaveDai from '../containers/SaveDai';
import SaveList from '../containers/SaveList';
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
    SaveList: {
      screen: SaveList,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Save'
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
    initialRouteName: 'SaveList'
  }
);

export default SaveStack;
