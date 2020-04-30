'use strict';
import { createStackNavigator } from 'react-navigation-stack';
import Initial from '../containers/Initial';
import Welcome from '../components/Welcome';
import NotificationPermissionTutorial from '../containers/NotificationPermissionTutorial';
import NotificationPermissionNotGranted from '../components/NotificationPermissionNotGranted';
import WalletCreation from '../containers/WalletCreation';
import ImportOptions from '../components/ImportOptions';
import ImportTwentyFourMnemonicWords from '../containers/ImportTwentyFourMnemonicWords';
import ImportTwelveMnemonicWords from '../containers/ImportTwelveMnemonicWords';
import CreateWalletTutorial from '../containers/CreateWalletTutorial';
import ShowMnemonic from '../containers/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import PortfolioHome from '../containers/PortfolioHome';
import Receive from '../containers/Receive';
import PortfolioWallet from '../containers/PortfolioWallet';
import PortfolioCompound from '../containers/PortfolioCompound';
import PortfolioPoolTogether from '../containers/PortfolioPoolTogether';
import PortfolioPoolTogetherOpen from '../containers/PortfolioPoolTogetherOpen';
import PortfolioPoolTogetherCommitted from '../containers/PortfolioPoolTogetherCommitted';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

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
    ImportOptions: {
      screen: ImportOptions,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'ImportOptions'
      })
    },
    ImportTwentyFourMnemonicWords: {
      screen: ImportTwentyFourMnemonicWords,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Import'
      })
    },
    ImportTwelveMnemonicWords: {
      screen: ImportTwelveMnemonicWords,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Import'
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
    initialRouteName: 'Initial'
  }
);

export default PortfolioStack;
