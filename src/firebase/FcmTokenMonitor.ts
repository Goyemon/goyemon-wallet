'use strict';
import messaging from '@react-native-firebase/messaging';
import { saveFcmToken } from '../actions/ActionDebugInfo';
import { store } from '../store/store';
import { FcmMsgs } from '../lib/fcm';
import LogUtilities from '../utilities/LogUtilities';

messaging().onTokenRefresh((fcmToken) => {
  const stateTree = store.getState();
  const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
  LogUtilities.logInfo('a new fcmToken is generated ===>', fcmToken);
  FcmMsgs.registerEthereumAddress(checksumAddress);
  store.dispatch(saveFcmToken(fcmToken));
  // TODO: if this happens we definitely need to let the server know, preferably with old token too.
});
