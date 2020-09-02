'use strict';
import { createStackNavigator } from 'react-navigation-stack';
import Swap from '../components/Swap/Swap';

const SwapStack = createStackNavigator(
  {
    Swap: {
      screen: Swap,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Swap'
      })
    }
  },
  {
    initialRouteName: 'Swap'
  }
);

export default SwapStack;
