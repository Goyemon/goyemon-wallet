'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnHome from '../containers/EarnHome';

const EarnStack = createStackNavigator(
  {
    EarnHome: {
      screen: EarnHome,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
  },
  {
    initialRouteName: 'EarnHome'
  }
);

export default EarnStack;
