'use strict';
import Web3 from 'web3';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import EtherUtilities from './EtherUtilities.js';

class ProviderUtilities {
  private infuraId = '884958b4538343aaa814e3a32718ce91';

  setProvider() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${this.infuraId}`)
    );

    return web3;
  }

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
