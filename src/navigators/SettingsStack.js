'use strict';
import { createStackNavigator } from 'react-navigation';
import Settings from '../components/Settings';

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: 'Settings'
  }
);

export default SettingsStack;
