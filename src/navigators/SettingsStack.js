'use strict';
import { createStackNavigator } from 'react-navigation';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        header: null
      })
    },
    BackupWords: {
      screen: BackupWords,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Advanced: {
      screen: Advanced,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }
  },
  {
    initialRouteName: 'Settings'
  }
);

export default SettingsStack;
