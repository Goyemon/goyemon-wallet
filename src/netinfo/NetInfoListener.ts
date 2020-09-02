'use strict';
import NetInfo from '@react-native-community/netinfo';
import { store } from '../store/store';
import { saveNetInfo } from '../actions/ActionNetInfo';

NetInfo.addEventListener((netState: any) => {
  store.dispatch(saveNetInfo(netState.isInternetReachable));
});
