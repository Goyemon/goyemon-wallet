'use strict';
import { createStackNavigator } from 'react-navigation';
import Initial from '../components/Initial';
import Welcome from '../components/Welcome';
import NotificationPermissionTutorial from '../components/NotificationPermissionTutorial';
import NotificationPermission from '../containers/NotificationPermission';
import Start from '../containers/Start';
import ImportOptions from '../components/ImportOptions';
import Import from '../components/Import';
import ShowMnemonic from '../components/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import Wallets from '../components/Wallets';
import Ethereum from '../containers/Ethereum';
import Send from '../containers/Send';
import Confirmation from '../containers/Confirmation';
import Receive from '../containers/Receive';
import Dai from '../containers/Dai';

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
    NotificationPermission: {
      screen: NotificationPermission,
      navigationOptions: () => ({
        header: null
      })
    },
    Start: {
      screen: Start,
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
    Import: {
      screen: Import,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Import'
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
    Wallets: {
      screen: Wallets,
      navigationOptions: () => ({
        headerLeft: null,
        headerTransparent: true,
        headerBackTitle: 'Home',
      })
    },
    Ethereum: {
      screen: Ethereum,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Ethereum'
      })
    },
    Send: {
      screen: Send,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Send'
      })
    },
    Confirmation: {
      screen: Confirmation,
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
    }
  },
  {
    initialRouteName: 'Initial'
  }
);

export default HomeStack;
