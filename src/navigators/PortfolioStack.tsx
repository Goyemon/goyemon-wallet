'use strict';
import { createStackNavigator } from 'react-navigation-stack';
import Initial from '../components/Initial';
import Welcome from '../components/Portfolio/Welcome';
import NotificationPermissionTutorial from '../components/Portfolio/NotificationPermission/NotificationPermissionTutorial';
import NotificationPermissionNotGranted from '../components/Portfolio/NotificationPermission/NotificationPermissionNotGranted';
import WalletCreation from '../components/Portfolio/WalletCreation';
import ImportMnemonicWords from '../components/Portfolio/ImportMnemonicWords';
import CreateWalletTutorial from '../components/Portfolio/CreateWalletTutorial';
import ShowMnemonic from '../components/Portfolio/ShowMnemonic';
import VerifyMnemonic from '../components/Portfolio/VerifyMnemonic';
import PortfolioHome from '../components/Portfolio/PortfolioHome';
import Receive from '../components/Portfolio/Receive';
import PortfolioWallet from '../components/Portfolio/PortfolioWallet';
import PortfolioCompound from '../components/Portfolio/PortfolioCompound';
import PortfolioPoolTogether from '../components/Portfolio/PortfolioPoolTogether';
import PortfolioPoolTogetherOpen from '../components/Portfolio/PortfolioPoolTogether/PortfolioPoolTogetherOpen';
import PortfolioPoolTogetherCommitted from '../components/Portfolio/PortfolioPoolTogether/PortfolioPoolTogetherCommitted';
import Settings from '../components/Portfolio/Settings';
import BackupWords from '../components/Portfolio/Settings/BackupWords';
import Advanced from '../components/Portfolio/Settings/Advanced';

const PortfolioStack = createStackNavigator(
  {
    Initial: {
      screen: Initial,
      navigationOptions: () => ({
        tabBarVisible: false,
        header: null
      })
    },
    Welcome: {
      screen: Welcome,
      navigationOptions: () => ({
        tabBarVisible: false,
        header: null
      })
    },
    NotificationPermissionTutorial: {
      screen: NotificationPermissionTutorial,
      navigationOptions: () => ({
        tabBarVisible: false,
        header: null
      })
    },
    NotificationPermissionNotGranted: {
      screen: NotificationPermissionNotGranted,
      navigationOptions: () => ({
        tabBarVisible: false,
        header: null
      })
    },
    WalletCreation: {
      screen: WalletCreation,
      navigationOptions: () => ({
        tabBarVisible: false,
        header: null
      })
    },
    ImportMnemonicWords: {
      screen: ImportMnemonicWords,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true,
        headerBackTitle: 'Import'
      })
    },
    CreateWalletTutorial: {
      screen: CreateWalletTutorial,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true
      })
    },
    ShowMnemonic: {
      screen: ShowMnemonic,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true
      })
    },
    VerifyMnemonic: {
      screen: VerifyMnemonic,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true
      })
    },
    PortfolioHome: {
      screen: PortfolioHome,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true,
        headerBackTitle: 'Portfolio',
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: () => ({
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
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
        tabBarVisible: false,
        headerTransparent: true
      })
    },
    Advanced: {
      screen: Advanced,
      navigationOptions: () => ({
        tabBarVisible: false,
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'Initial'
  }
);

export default PortfolioStack;
