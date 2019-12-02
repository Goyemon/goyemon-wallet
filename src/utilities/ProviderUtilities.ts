'use strict';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import EtherUtilities from './EtherUtilities.js';

class ProviderUtilities {
  async registerEthereumAddress(checksumAddress) {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const checksumAddressWithoutPrefix = EtherUtilities.stripHexPrefix(checksumAddress);

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        register: 'true',
        address: checksumAddressWithoutPrefix
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }
}

export default new ProviderUtilities();
