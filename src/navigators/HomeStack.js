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
import WalletList from '../containers/WalletList';
import SendEth from '../containers/SendEth';
import QRCodeScan from '../containers/QRCodeScan';
import SendEthConfirmation from '../containers/SendEthConfirmation';
import Receive from '../containers/Receive';
import Dai from '../containers/Dai';
import SendDai from '../containers/SendDai';
import SendDaiConfirmation from '../containers/SendDaiConfirmation';

const HomeStack = createStackNavigator(
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
    WalletList: {
      screen: WalletList,
      navigationOptions: () => ({
        headerLeft: null,
        headerTransparent: true,
        headerBackTitle: 'Wallets'
      })
    },
    SendEth: {
      screen: SendEth,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SendEth'
      })
    },
    QRCodeScan: {
      screen: QRCodeScan,
      navigationOptions: () => ({
        header: null,
        gesturesEnabled: false
      })
    },
    SendEthConfirmation: {
      screen: SendEthConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Dai: {
      screen: Dai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Dai'
      })
    },
    SendDai: {
      screen: SendDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SendDai'
      })
    },
    SendDaiConfirmation: {
      screen: SendDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SendDaiConfirmation'
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

export default HomeStack;
