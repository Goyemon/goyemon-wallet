'use strict';
import { createStackNavigator } from 'react-navigation';
import WalletList from '../containers/WalletList';
import SendEth from '../containers/SendEth';
import QRCodeScan from '../containers/QRCodeScan';
import SendEthConfirmation from '../containers/SendEthConfirmation';
import Receive from '../containers/Receive';
import SendDai from '../containers/SendDai';
import SendDaiConfirmation from '../containers/SendDaiConfirmation';

const SendStack = createStackNavigator(
  {
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
    initialRouteName: 'WalletList'
  }
);

export default SendStack;
