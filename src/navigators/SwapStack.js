'use strict';
import { createStackNavigator } from 'react-navigation';
import SwapHome from '../containers/SwapHome';

const SwapStack = createStackNavigator(
  {
    SwapHome: {
      screen: SwapHome,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SwapHome'
      })
    }
  },
  {
    initialRouteName: 'SwapHome'
  }
);

export default SwapStack;
