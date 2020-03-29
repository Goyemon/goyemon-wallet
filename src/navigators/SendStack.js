'use strict';
import { createStackNavigator } from 'react-navigation';
import Send from '../components/Send';
import SendEth from '../containers/SendEth';
import QRCodeScan from '../containers/QRCodeScan';
import SendEthConfirmation from '../containers/SendEthConfirmation';
import SendDai from '../containers/SendDai';
import SendDaiConfirmation from '../containers/SendDaiConfirmation';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

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
    },
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: { marginTop: 18 }
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
    initialRouteName: 'Send'
  }
);

export default SendStack;
