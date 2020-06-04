'use strict';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import EtherUtilities from '../utilities/EtherUtilities.js';
import GlobalConfig from '../config.json';

// TODO: this file should be removed, those methods are I believe in FCM.FCMMsgs already.

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

  requestCompoundDaiInfo(checksumAddress) {
    this.__sendMessage('cDai_lending_info', checksumAddress);
  }

  requestPoolTogetherDaiInfo(checksumAddress) {
    this.__sendMessage('pool_together_DAI_info', checksumAddress);
  }

  requestUniswapV2WETHxDAIReserves(checksumAddress) {
    this.__sendMessage('uniswapV2_WETHxDAI_reserve', checksumAddress);
  }
}

export default new FcmUpstreamMsgs();
