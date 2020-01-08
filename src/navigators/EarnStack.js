'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnDai from '../components/EarnDai';
import EarnList from '../components/EarnList';

const EarnStack = createStackNavigator(
  {
    EarnDai: {
      screen: EarnDai,
      navigationOptions: () => ({
        headerTransparent: true,
      })
    },
    EarnList: {
      screen: EarnList,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Earn'
      })
    },
      })
    }
  },
  {
    initialRouteName: 'EarnList'
  }
);

export default EarnStack;
