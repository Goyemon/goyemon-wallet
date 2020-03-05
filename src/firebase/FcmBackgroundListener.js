'use strict';
import FcmListener from './FcmListener.js';

export default async downstreamMessage => {
  await FcmListener.downstreamMessageHandler(downstreamMessage);

  return Promise.resolve();
}
