'use strict';
import FcmListener from './FcmListener.js';
import FCM from '../lib/fcm.js';

FCM.FCMMsgs.setMsgCallback(FcmListener.downstreamMessageHandler); // so now FcmListener is just a callback we attach to FCMMsgs.

export default async downstreamMessage => {
  await FCM.downstreamMessageHandler(downstreamMessage, true);

  return Promise.resolve();
}
