'use strict';
import { createStackNavigator } from 'react-navigation-stack';
import Send from '../components//Send/Send';
import QRCodeScan from '../components/Send/QRCodeScan';

const SendStack = createStackNavigator(
  {
    Send: {
      screen: Send,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Send'
      })
    },
    QRCodeScan: {
      screen: QRCodeScan,
      navigationOptions: () => ({
        header: null,
        gesturesEnabled: false
      })
    }
  },
  {
    initialRouteName: 'Send'
  }
);

export default SendStack;
