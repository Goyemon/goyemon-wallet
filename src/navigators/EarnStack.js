'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnList from '../components/EarnList';

const EarnStack = createStackNavigator(
  {
    EarnList: {
      screen: EarnList,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: 'EarnList'
  }
);

export default EarnStack;
