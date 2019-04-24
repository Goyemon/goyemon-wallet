'use strict';
import { createStackNavigator } from 'react-navigation';
import Welcome from '../components/Welcome';
import Start from '../containers/Start';
import Import from '../components/Import';
import ShowMnemonic from '../containers/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import Wallets from '../components/Wallets';
import Ethereum from '../components/Ethereum';
import Send from '../components/Send';
import Confirmation from '../components/Confirmation';
import Receive from '../components/Receive';
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
        title: 'Import'
      })
    },
    ShowMnemonic: {
      screen: ShowMnemonic,
      navigationOptions: () => ({
        title: 'ShowMnemonic'
      })
    },
    VerifyMnemonic: {
      screen: VerifyMnemonic
    },
    Wallets: {
      screen: Wallets,
      navigationOptions: () => ({
        title: 'Wallets'
      })
    },
    Ethereum: {
      screen: Ethereum,
      navigationOptions: () => ({
        title: 'Ethereum'
      })
    },
    Send: {
      screen: Send,
      navigationOptions: () => ({
        title: 'Send'
      })
    },
    Confirmation: {
      screen: Confirmation,
      navigationOptions: () => ({
        title: 'Confirmation'
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: () => ({
        title: 'Receive'
      })
    },
    Dai: {
      screen: Dai,
      navigationOptions: () => ({
        title: 'Dai'
      })
    }
  },
  {
    initialRouteName: 'Welcome'
  }
);

export default HomeStack;
