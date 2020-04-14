'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnHome from '../components/EarnHome';
import DepositDaiToCompound from '../containers/DepositDaiToCompound';
import DepositDaiToCompoundConfirmation from '../containers/DepositDaiToCompoundConfirmation';
import DepositFirstDaiToCompound from '../containers/DepositFirstDaiToCompound';
import DepositFirstDaiToCompoundConfirmation from '../containers/DepositFirstDaiToCompoundConfirmation';
import WithdrawDai from '../containers/WithdrawDai';
import WithdrawDaiConfirmation from '../containers/WithdrawDaiConfirmation';
import DepositDaiToPoolTogether from '../containers/DepositDaiToPoolTogether';
import DepositDaiToPoolTogetherConfirmation from '../containers/DepositDaiToPoolTogetherConfirmation';
import DepositFirstDaiToPoolTogether from '../containers/DepositFirstDaiToPoolTogether';
import DepositFirstDaiToPoolTogetherConfirmation from '../containers/DepositFirstDaiToPoolTogetherConfirmation';
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
    DepositDaiToCompound: {
      screen: DepositDaiToCompound,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositDaiToCompoundConfirmation: {
      screen: DepositDaiToCompoundConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    DepositFirstDaiToCompound: {
      screen: DepositFirstDaiToCompound,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositFirstDaiToCompoundConfirmation: {
      screen: DepositFirstDaiToCompoundConfirmation,
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
    DepositFirstDaiToPoolTogether: {
      screen: DepositFirstDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit',
      }),
    },
    DepositFirstDaiToPoolTogetherConfirmation: {
      screen: DepositFirstDaiToPoolTogetherConfirmation,
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
