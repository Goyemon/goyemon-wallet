'use strict';
import { createStackNavigator } from 'react-navigation';
import SendEth from '../containers/SendEth';
import QRCodeScan from '../containers/QRCodeScan';
import SendEthConfirmation from '../containers/SendEthConfirmation';
import SendDai from '../containers/SendDai';
import SendDaiConfirmation from '../containers/SendDaiConfirmation';

const SendStack = createStackNavigator(
  {
      navigationOptions: () => ({
        headerTransparent: true,
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
    initialRouteName: 'Send'
  }
);

export default SendStack;
