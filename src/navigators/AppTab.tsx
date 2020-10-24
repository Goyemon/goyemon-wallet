"use strict";
import React from "react";
import { Provider } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createAppContainer } from "react-navigation";
import { PersistGate } from "redux-persist/integration/react";
import "../firebase/FcmTokenMonitor";
import I18n from "../i18n/I18n";
import "../netinfo/NetInfoListener";
import PortfolioStack from "./PortfolioStack";
import EarnStack from "./EarnStack";
import HistoryStack from "./HistoryStack";
import SendStack from "./SendStack";
import SwapStack from "./SwapStack";
import { Loader } from "../components/common";
import { store, persistor } from "../store/store";
const { createBottomTabNavigator } = require("react-navigation-tabs");

const AppTab = createBottomTabNavigator(
  {
    Portfolio: {
      screen: PortfolioStack,
      path: "portfolio",
      navigationOptions: {
        tabBarLabel: I18n.t("portfolio"),
        tabBarIcon: ({ tintColor }: any) => (
          <Icon name="chart-pie" size={30} color={tintColor} />
        )
      }
    },
    Send: {
      screen: SendStack,
      navigationOptions: {
        tabBarLabel: I18n.t("send"),
        tabBarIcon: ({ tintColor }: any) => (
          <Icon name="send" size={30} color={tintColor} />
        )
      }
    },
    Earn: {
      screen: EarnStack,
      navigationOptions: {
        tabBarLabel: I18n.t("earn"),
        tabBarIcon: ({ tintColor }: any) => (
          <Icon name="signal-cellular-3" size={30} color={tintColor} />
        )
      }
    },
    Swap: {
      screen: SwapStack,
      navigationOptions: {
        tabBarLabel: I18n.t("swap"),
        tabBarIcon: ({ tintColor }: any) => (
          <Icon name="swap-horizontal" size={30} color={tintColor} />
        )
      }
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel: I18n.t("history"),
        tabBarIcon: ({ tintColor }: any) => (
          <Icon name="script-text-outline" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "#00A3E2",
      style: {
        height: 56
      },
      labelStyle: {
        fontSize: 12,
        fontFamily: "HKGrotesk-Bold",
        marginBottom: 0
      },
      tabStyle: {
        marginTop: 8
      }
    }
  },
  {
    initialRouteName: "Portfolio"
  }
);

const App = createAppContainer(AppTab);
const uriPrefix = "goyemon://";

export default () => (
  <Provider store={store}>
    <PersistGate
      loading={<Loader animating={true} size="large" />}
      persistor={persistor}
    >
      <App uriPrefix={uriPrefix} />
    </PersistGate>
  </Provider>
);
