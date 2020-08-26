'use strict';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import LogUtilities from '../utilities/LogUtilities.js';
import zlib from 'react-zlib-js';
import TxStorage from '../lib/tx.js';

import GlobalConfig from '../config.json';

const msgtype_compressed = {
  txhistory: true,
  txstate: true,
  txsync: true
};

class Msg {
  constructor(id, count, type) {
    LogUtilities.toDebugScreen(`MSG constructor, id:${id}, count:${count}`);
    this.data = [];
    this.count = count;
    this.have = 0;
    this.id = id;
    this.compressed = msgtype_compressed[type];
  }

  addPart(num, data) {
    LogUtilities.toDebugScreen(
      `MSG addPart, id:${this.id}, num:${num}, have:${this.have}+1/${this.count}`
    );
    if (this.data[num])
      throw new Error(`duplicate part ${num} for message batch id ${this.id}`);

    this.data[num] = data;
    this.have++;

    return this;
  }

  isComplete() {
    return this.have == this.count;
  }

  getMessage(call) {
    if (!this.isComplete())
      throw new Error('.getMessage() for an incomplete message');

    if (!this.compressed) call(this.data.join(''));
    else
      zlib.inflateRaw(Buffer.from(this.data.join(''), 'base64'), (err, ret) => {
        if (err) throw new Error(err);

        call(ret);
      });
  }
}

class FCMMsgs {
  constructor(on_msg_callback, on_msg_timeout, timeoutsecs = 30) {
    this.msgs = {};
    this.tos = {};
    this.msgtype_waits = {};
    this.on_msg_callback = on_msg_callback;
    this.on_msg_timeout = on_msg_timeout;
    this.timeout = timeoutsecs * 1000;

    this.__msgid_time = null;
    this.__msgid_n = 0;
  }

  setTimeout(timeoutsecs) {
    this.timeout = timeoutsecs * 1000;

    return this;
  }

  setMsgCallback(on_msg_callback) {
    this.on_msg_callback = on_msg_callback;

    return this;
  }

  setTimeoutCallback(on_msg_timeout) {
    this.on_msg_timeout = on_msg_timeout;

    return this;
  }

  async getFcmToken() {
    return await firebase.messaging().getToken();
  }

  __gen_msg_id() {
    let t = Date.now();
    if (t == this.__msgid_time) {
      this.__msgid_n++;
      return `m${this.__msgid_time}_${this.__msgid_n}`;
    }
    this.__msgid_n = 0;
    this.__msgid_time = t;
    return `m${this.__msgid_time}`;
  }

  __sendMessage(type, otherData = {}) {
    const upstreamMessage = {
      messageId: this.__gen_msg_id(),
      to: GlobalConfig.FCM_server_address,
      data: {
        type: type,
        ...otherData
      }
    };

    firebase
      .messaging()
      .sendMessage(upstreamMessage)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  __on_msg(id, type, num, count, data) {
    let msg;

    if (!this.msgs[id]) {
      msg = new Msg(id, count, type);

      this.msgs[id] = msg;

      if (count > 1 && this.on_msg_timeout)
        this.tos[id] = setTimeout(() => {
          this.on_msg_timeout(msg);
        }, this.timeout);
      // TODO: remove msgs[id] and tos[id] on timeout?
    } else msg = this.msgs[id];

    msg.addPart(num, data);

    if (msg.isComplete()) {
      if (this.tos[id]) {
        clearTimeout(this.tos[id]);
        delete this.tos[id];
      }
      delete this.msgs[id];

      msg.getMessage((msg) => {
        const result = JSON.parse(msg);
        if (this.msgtype_waits.hasOwnProperty(type)) {
          this.msgtype_waits[type].forEach((x) => x.resolve(result));
          delete this.msgtype_waits[type];
        } else this.on_msg_callback(type, result);
      });
    }
  }

  __fcm_msg(msg, frombg) {
    const d = msg._data ? msg._data : msg.data;

    if (frombg && d && d.type && d.count && d.no && d.uid && d.data)
      LogUtilities.toDebugScreen(
        `BG message: uid:${d.uid} type:${d.type} no/cnt:${d.no}/${d.count}`
      );

    if (d && d.type && d.count && d.no && d.uid && d.data)
      this.__on_msg(d.uid, d.type, d.no, d.count, d.data);
    else if (d && d.type == 'transactionError' && d.error)
      this.on_msg_callback(d.type, d);
    // TODO: we're bypassing __on_msg() here due to different msg format, but that means we can't (in the future) use msgtype_waits for transactionError. change the format to the same (use sendSplitMsg() in FCM) in the future and stop treating them differently here.
    else
      LogUtilities.toDebugScreen(
        `unknown FCM message type (bg:${frombg}):`,
        msg
      );
  }

  registerEthereumAddress(checksumAddress) {
    this.__sendMessage('address_register', { address: checksumAddress });
  }

  resyncWallet(checksumAddress) {
    this.__sendMessage('resync_wallet', { address: checksumAddress });
  }

  requestCompoundDaiInfo(checksumAddress) {
    this.__sendMessage('cDai_lending_info', { address: checksumAddress });
  }

  requestPoolTogetherDaiInfo(checksumAddress) {
    this.__sendMessage('pool_together_DAI_info', { address: checksumAddress });
  }

  requestUniswapV2WETHxDAIReserves() {
    this.__sendMessage('uniswapV2_WETHxDAI_reserve');
  }

  checkForUpdates(checksumAddress, checksums, count, offset = 0) {
    this.__sendMessage('request_updates', {
      address: checksumAddress,
      sums: checksums.join(','),
      items: count.toString(),
      offset: offset.toString(),
      v: TxStorage.storage.temporary_since_you_wont_add_build_number_i_will.toString()
    });
  }

  sendTx() {}
}

const instance = new FCMMsgs();
const handler = (x, frombg) => instance.__fcm_msg(x, frombg);

function registerHandler() {
  LogUtilities.toDebugScreen('FCM registerHandler called');
  firebase.messaging().onMessage(handler);
}

module.exports = {
  registerHandler: registerHandler,
  downstreamMessageHandler: handler,
  FCMMsgs: instance
};
