'use strict';
import { createStackNavigator } from 'react-navigation';
import Welcome from '../components/Welcome';
import Start from '../containers/Start';
import Import from '../components/Import';
import ShowMnemonic from '../containers/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import Wallets from '../components/Wallets';
import Ethereum from '../containers/Ethereum';
import Send from '../containers/Send';
import Confirmation from '../containers/Confirmation';
import Receive from '../containers/Receive';
import Dai from '../components/Dai';

const HomeStack = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
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
        headerTransparent: true,
        headerBackTitle: 'Home'
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
    initialRouteName: 'Welcome'
  }
);

export default HomeStack;
