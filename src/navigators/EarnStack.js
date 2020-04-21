'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnHome from '../components/EarnHome';
import DepositDaiToCompound from '../containers/DepositDaiToCompound';
import DepositFirstDaiToCompound from '../containers/DepositFirstDaiToCompound';
import DepositFirstDaiToCompoundConfirmation from '../containers/DepositFirstDaiToCompoundConfirmation';
import WithdrawDaiFromCompound from '../containers/WithdrawDaiFromCompound';
import DepositDaiToPoolTogether from '../containers/DepositDaiToPoolTogether';
import DepositFirstDaiToPoolTogether from '../containers/DepositFirstDaiToPoolTogether';
import DepositFirstDaiToPoolTogetherConfirmation from '../containers/DepositFirstDaiToPoolTogetherConfirmation';
import WithdrawDaiFromPoolTogether from '../containers/WithdrawDaiFromPoolTogether';

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
    WithdrawDaiFromCompound: {
      screen: WithdrawDaiFromCompound,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Withdraw'
      })
    },
    DepositDaiToPoolTogether: {
      screen: DepositDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositFirstDaiToPoolTogether: {
      screen: DepositFirstDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositFirstDaiToPoolTogetherConfirmation: {
      screen: DepositFirstDaiToPoolTogetherConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    WithdrawDaiFromPoolTogether: {
      screen: WithdrawDaiFromPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    }
  },
  {
    initialRouteName: 'EarnHome'
  }
);

export default EarnStack;
