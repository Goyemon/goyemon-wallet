"use strict";
import { createStackNavigator } from "react-navigation-stack";
import Initial from "../components/Initial";
import Welcome from "../components/Portfolio/Welcome/Welcome";
import NotificationPermissionTutorial from "../components/Portfolio/NotificationPermission/NotificationPermissionTutorial";
import WalletCreation from "../components/Portfolio/WalletCreation/WalletCreation";
import ImportMnemonicWords from "../components/Portfolio/ImportMnemonicWords/ImportMnemonicWords";
import CreateWalletTutorial from "../components/Portfolio/CreateWalletTutorial/CreateWalletTutorial";
import ShowMnemonic from "../components/Portfolio/ShowMnemonic/ShowMnemonic";
import VerifyMnemonic from "../components/Portfolio/VerifyMnemonic/VerifyMnemonic";
import PortfolioHome from "../components/Portfolio/PortfolioHome/PortfolioHome";
import Receive from "../components/Portfolio/Receive/Receive";
import BuyCrypto from "../components/Portfolio/BuyCrypto/BuyCrypto";
import SimplexWebView from "../components/Portfolio/BuyCrypto/SimplexWebView";
import PortfolioWallet from "../components/Portfolio/PortfolioWallet/PortfolioWallet";
import PortfolioCompound from "../components/Portfolio/PortfolioCompound/PortfolioCompound";
import PortfolioPoolTogether from "../components/Portfolio/PortfolioPoolTogether/PortfolioPoolTogether";
import Settings from "../components/Portfolio/Settings/Settings";
import BackupWords from "../components/Portfolio/Settings/BackupWords";
import Advanced from "../components/Portfolio/Settings/Advanced";

const PortfolioStack = createStackNavigator(
  {
    Initial: {
      screen: Initial,
      navigationOptions: () => ({
        header: null
      })
    },
    Welcome: {
      screen: Welcome,
      navigationOptions: () => ({
        header: null
      })
    },
    NotificationPermissionTutorial: {
      screen: NotificationPermissionTutorial,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    WalletCreation: {
      screen: WalletCreation,
      navigationOptions: () => ({
        header: null
      })
    },
    ImportMnemonicWords: {
      screen: ImportMnemonicWords,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: "Import"
      })
    },
    CreateWalletTutorial: {
      screen: CreateWalletTutorial,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    ShowMnemonic: {
      screen: ShowMnemonic,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    VerifyMnemonic: {
      screen: VerifyMnemonic,
      navigationOptions: () => ({
        headerTransparent: true,
        gesturesEnabled: false
      })
    },
    PortfolioHome: {
      screen: PortfolioHome,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: "Portfolio",
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    BuyCrypto: {
      screen: BuyCrypto,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    SimplexWebView: {
      screen: SimplexWebView,
      navigationOptions: () => ({
        headerTransparent: true,
        gesturesEnabled: false,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    PortfolioWallet: {
      screen: PortfolioWallet,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    PortfolioCompound: {
      screen: PortfolioCompound,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    PortfolioPoolTogether: {
      screen: PortfolioPoolTogether,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        headerTransparent: true,
        gesturesEnabled: false,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
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
    navigationOptions: {
      tabBarVisible: false
    }
  },
  {
    initialRouteName: "Initial"
  }
);

export default PortfolioStack;
