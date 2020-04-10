'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnHome from '../components/EarnHome';
import DepositDai from '../containers/DepositDai';
import DepositDaiConfirmation from '../containers/DepositDaiConfirmation';
import DepositFirstDai from '../containers/DepositFirstDai';
import DepositFirstDaiConfirmation from '../containers/DepositFirstDaiConfirmation';
import WithdrawDai from '../containers/WithdrawDai';
import WithdrawDaiConfirmation from '../containers/WithdrawDaiConfirmation';
import DepositDaiToPoolTogether from '../containers/DepositDaiToPoolTogether';
import DepositDaiToPoolTogetherConfirmation from '../containers/DepositDaiToPoolTogetherConfirmation';
import WithdrawDaiFromPoolTogether from '../containers/WithdrawDaiFromPoolTogether';
import WithdrawDaiFromPoolTogetherConfirmation from '../containers/WithdrawDaiFromPoolTogetherConfirmation';

const EarnStack = createStackNavigator(
  {
    EarnHome: {
      screen: EarnHome,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Earn'
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
    DepositFirstDai: {
      screen: DepositFirstDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositFirstDaiConfirmation: {
      screen: DepositFirstDaiConfirmation,
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
    },
    DepositDaiToPoolTogether: {
      screen: DepositDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit',
      }),
    },
    DepositDaiToPoolTogetherConfirmation: {
      screen: DepositDaiToPoolTogetherConfirmation,
      navigationOptions: () => ({
        headerTransparent: true,
      }),
    },
    WithdrawDaiFromPoolTogether: {
      screen: WithdrawDaiFromPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit',
      }),
    },
    WithdrawDaiFromPoolTogetherConfirmation: {
      screen: WithdrawDaiFromPoolTogetherConfirmation,
      navigationOptions: () => ({
        headerTransparent: true,
      }),
    },
  },
  {
    initialRouteName: 'EarnHome'
  }
);

export default EarnStack;
