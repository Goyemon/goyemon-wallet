'use strict';
import { createStackNavigator } from 'react-navigation';
import SaveDai from '../containers/SaveDai';

const SaveStack = createStackNavigator(
  {
    SaveDai: {
      screen: SaveDai,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'SaveDai'
  }
);

export default SaveStack;
