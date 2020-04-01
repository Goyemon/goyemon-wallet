'use strict';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import EtherUtilities from '../utilities/EtherUtilities.js';
import GlobalConfig from '../config.json';

class FcmUpstreamMsgs {
  __sendMessage(type, checksumAddress) {
    const checksumAddressWithoutPrefix = EtherUtilities.stripHexPrefix(
      checksumAddress
    );

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(uuidv4())
      .setTo(GlobalConfig.FCM_server_address)
      .setData({
        type: type,
        address: checksumAddressWithoutPrefix
      });

    firebase.messaging().sendMessage(upstreamMessage);
  }

  registerEthereumAddress(checksumAddress) {
    this.__sendMessage('address_register', checksumAddress);
  }

  resyncWallet(checksumAddress) {
    this.__sendMessage('resync_wallet', checksumAddress);
  }

  requestCDaiLendingInfo(checksumAddress) {
    this.__sendMessage('cDai_lending_info', checksumAddress);
  }

  requestUniswapETHDAIBalances(checksumAddress) {
    this.__sendMessage('uniswap_ETHDAI_info', checksumAddress);
  }
}

export default new FcmUpstreamMsgs();
