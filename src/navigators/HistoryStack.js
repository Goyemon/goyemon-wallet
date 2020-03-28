'use strict';
import { createStackNavigator } from 'react-navigation';
import History from '../components/History';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

const HistoryStack = createStackNavigator(
  {
    History: {
      screen: History,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'History'
      })
    },
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: { marginTop: 18 }
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
    initialRouteName: 'History'
  }
);

export default HistoryStack;
