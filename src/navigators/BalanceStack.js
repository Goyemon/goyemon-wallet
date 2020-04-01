'use strict';
import { createStackNavigator } from 'react-navigation';
import Initial from '../components/Initial';
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
import BalanceHome from '../containers/BalanceHome';
import Receive from '../containers/Receive';
import BalanceWallet from '../containers/BalanceWallet';
import BalanceCompound from '../containers/BalanceCompound';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

const BalanceStack = createStackNavigator(
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
    BalanceHome: {
      screen: BalanceHome,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Balance',
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
    BalanceWallet: {
      screen: BalanceWallet,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          marginTop: 16,
          marginRight: 16
        }
      })
    },
    BalanceCompound: {
      screen: BalanceCompound,
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

export default BalanceStack;
