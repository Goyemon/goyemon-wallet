'use strict';
import { createStackNavigator } from 'react-navigation';
import Start from '../containers/Start';
import Import from '../components/Import';
import ShowMnemonic from '../containers/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import Wallet from '../components/Wallet';
import Ethereum from '../components/Ethereum';
import Send from '../components/Send';
import Receive from '../components/Receive';
import Dai from '../components/Dai';

const HomeStack = createStackNavigator(
  {
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
    Wallet: {
      screen: Wallet,
      navigationOptions: () => ({
        title: 'Wallet'
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
    initialRouteName: 'Start'
  }
);

export default HomeStack;
