'use strict';
import { createStackNavigator } from 'react-navigation';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import DeviceInfo from '../components/DeviceInfo';

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
    DeviceInfo: {
      screen: DeviceInfo,
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
