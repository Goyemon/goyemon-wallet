'use strict';
import { createStackNavigator } from 'react-navigation';
import Swap from '../containers/Swap';
import SwapConfirmation from '../containers/SwapConfirmation';

const SwapStack = createStackNavigator(
  {
    Swap: {
      screen: Swap,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Swap'
      })
    },
    SwapConfirmation: {
      screen: SwapConfirmation,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SwapConfirmation'
      })
    }
  },
  {
    initialRouteName: 'Swap'
  }
);

export default SwapStack;
