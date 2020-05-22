'use strict';
import FcmListener from './FcmListener.js';
import FCM from '../lib/fcm.js';

import AsyncStorage from '@react-native-community/async-storage';

FCM.FCMMsgs.setMsgCallback(FcmListener.downstreamMessageHandler); // so now FcmListener is just a callback we attach to FCMMsgs.

// var bgmsgcnt = 0;

export default async (downstreamMessage) => {
  //await AsyncStorage.setItem(`bgmsg_${bgmsgcnt++}`, JSON.stringify(downstreamMessage));

  await FCM.downstreamMessageHandler(downstreamMessage, true);

  return Promise.resolve();
};
