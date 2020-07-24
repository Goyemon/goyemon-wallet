'use strict';
import { createStackNavigator } from 'react-navigation-stack';
import History from '../components/History/History';

const HistoryStack = createStackNavigator(
  {
    History: {
      screen: History,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'History'
      })
    }
  },
  {
    initialRouteName: 'History'
  }
);

export default HistoryStack;
