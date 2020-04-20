'use strict';
import { createStackNavigator } from 'react-navigation';
import Send from '../components/Send';
import SendEth from '../containers/SendEth';
import QRCodeScan from '../containers/QRCodeScan';
import SendDai from '../containers/SendDai';
import SendDaiConfirmation from '../containers/SendDaiConfirmation';

const SendStack = createStackNavigator(
  {
    Send: {
      screen: Send,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Send'
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
