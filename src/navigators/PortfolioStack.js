"use strict";
import { createStackNavigator } from "react-navigation-stack";
import Initial from "../components/Initial";
import Welcome from "../components/Portfolio/Welcome";
import NotificationPermissionTutorial from "../components/Portfolio/NotificationPermission/NotificationPermissionTutorial";
import NotificationPermissionNotGranted from "../components/Portfolio/NotificationPermission/NotificationPermissionNotGranted";
import WalletCreation from "../components/Portfolio/WalletCreation";
import ImportMnemonicWords from "../components/Portfolio/ImportMnemonicWords";
import CreateWalletTutorial from "../components/Portfolio/CreateWalletTutorial";
import ShowMnemonic from "../components/Portfolio/ShowMnemonic";
import VerifyMnemonic from "../components/Portfolio/VerifyMnemonic";
import PortfolioHome from "../components/Portfolio/PortfolioHome";
import Receive from "../components/Portfolio/Receive";
import PortfolioWallet from "../components/Portfolio/PortfolioWallet";
import PortfolioCompound from "../components/Portfolio/PortfolioCompound";
import PortfolioPoolTogether from "../components/Portfolio/PortfolioPoolTogether";
import PortfolioPoolTogetherOpen from "../components/Portfolio/PortfolioPoolTogether/PortfolioPoolTogetherOpen";
import PortfolioPoolTogetherCommitted from "../components/Portfolio/PortfolioPoolTogether/PortfolioPoolTogetherCommitted";
import Settings from "../components/Portfolio/Settings";
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
        header: null
      })
    },
    NotificationPermissionNotGranted: {
      screen: NotificationPermissionNotGranted,
      navigationOptions: () => ({
        header: null
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
        headerTransparent: true
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
    PortfolioPoolTogetherOpen: {
      screen: PortfolioPoolTogetherOpen,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    PortfolioPoolTogetherCommitted: {
      screen: PortfolioPoolTogetherCommitted,
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
