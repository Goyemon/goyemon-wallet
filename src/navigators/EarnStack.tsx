"use strict";
import { createStackNavigator } from "react-navigation-stack";
import EarnHome from "../components/Earn/EarnHome";
import DepositDaiToCompound from "../components/Earn/DepositDaiToCompound";
import DepositFirstDaiToCompound from "../components/Earn/DepositFirstDaiToCompound";
import WithdrawDaiFromCompound from "../components/Earn/WithdrawDaiFromCompound";
import DepositDaiToPoolTogether from "../components/Earn/DepositDaiToPoolTogether";
import DepositFirstDaiToPoolTogether from "../components/Earn/DepositFirstDaiToPoolTogether";
import WithdrawDaiFromPoolTogether from "../components/Earn/WithdrawDaiFromPoolTogether";

const EarnStack = createStackNavigator(
  {
    EarnHome: {
      screen: EarnHome,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Earn"
      })
    },
    DepositDaiToCompound: {
      screen: DepositDaiToCompound,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Deposit"
      })
    },
    DepositFirstDaiToCompound: {
      screen: DepositFirstDaiToCompound,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Deposit"
      })
    },
    WithdrawDaiFromCompound: {
      screen: WithdrawDaiFromCompound,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Withdraw"
      })
    },
    DepositDaiToPoolTogether: {
      screen: DepositDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Deposit"
      })
    },
    DepositFirstDaiToPoolTogether: {
      screen: DepositFirstDaiToPoolTogether,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Deposit"
      })
    },
    WithdrawDaiFromPoolTogether: {
      screen: WithdrawDaiFromPoolTogether,
      navigationOptions: () => ({
        headerTransparent: false,
        headerBackTitle: "Deposit"
      })
    }
  },
  {
    initialRouteName: "EarnHome"
  }
);

export default EarnStack;
