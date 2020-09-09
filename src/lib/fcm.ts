"use strict";
import firebase from "@react-native-firebase/app";
import LogUtilities from "../utilities/LogUtilities";
const zlib = require("react-zlib-js");
import { storage } from "./tx";
const GlobalConfig = require("../config.json");

const msgtype_compressed: any = {
  txhistory: true,
  txstate: true,
  txsync: true
};

class Msg {
  data: any;
  count: any;
  have: any;
  id: any;
  compressed: any;
  constructor(id: any, count: any, type: any) {
    LogUtilities.toDebugScreen(`MSG constructor, id:${id}, count:${count}`);
    this.data = [];
    this.count = count;
    this.have = 0;
    this.id = id;
    this.compressed = msgtype_compressed[type];
  }

  addPart(num: any, data: any) {
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

  getMessage(call: any) {
    if (!this.isComplete())
      throw new Error(".getMessage() for an incomplete message");

    if (!this.compressed) call(this.data.join(""));
    else
      zlib.inflateRaw(
        Buffer.from(this.data.join(""), "base64"),
        (err: any, ret: any) => {
          if (err) throw new Error(err);

          call(ret);
        }
      );
  }
}

class FCMMsgs {
  msgs: any;
  tos: any;
  msgtype_waits: any;
  on_msg_callback: any;
  on_msg_timeout: any;
  timeout: any;
  __msgid_time: any;
  __msgid_n: any;
  constructor(on_msg_callback: any, on_msg_timeout: any, timeoutsecs = 30) {
    this.msgs = {};
    this.tos = {};
    this.msgtype_waits = {};
    this.on_msg_callback = on_msg_callback;
    this.on_msg_timeout = on_msg_timeout;
    this.timeout = timeoutsecs * 1000;

    this.__msgid_time = null;
    this.__msgid_n = 0;
  }

  setTimeout(timeoutsecs: any) {
    this.timeout = timeoutsecs * 1000;

    return this;
  }

  setMsgCallback(on_msg_callback: any) {
    this.on_msg_callback = on_msg_callback;

    return this;
  }

  setTimeoutCallback(on_msg_timeout: any) {
    this.on_msg_timeout = on_msg_timeout;

    return this;
  }

  async getFcmToken() {
    return await firebase.messaging().getToken();
  }

  __gen_msg_id() {
    const t = Date.now();
    if (t == this.__msgid_time) {
      this.__msgid_n++;
      return `m${this.__msgid_time}_${this.__msgid_n}`;
    }
    this.__msgid_n = 0;
    this.__msgid_time = t;
    return `m${this.__msgid_time}`;
  }

  __sendMessage(type: any, otherData = {}) {
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
        console.log("Successfully sent message:", {
          type: upstreamMessage.data.type,
          upstreamMessage: upstreamMessage,
          response: response
        });
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }

  __on_msg(id: any, type: any, num: any, count: any, data: any) {
    let msg: any;

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

      msg.getMessage((msg: any) => {
        const result = JSON.parse(msg);
        if (this.msgtype_waits.hasOwnProperty(type)) {
          this.msgtype_waits[type].forEach((x: any) => x.resolve(result));
          delete this.msgtype_waits[type];
        } else this.on_msg_callback(type, result);
      });
    }
  }

  __fcm_msg(msg: any, frombg: any) {
    const d = msg._data ? msg._data : msg.data;

    if (frombg && d && d.type && d.count && d.no && d.uid && d.data)
      LogUtilities.toDebugScreen(
        `BG message: uid:${d.uid} type:${d.type} no/cnt:${d.no}/${d.count}`
      );

    if (d && d.type && d.count && d.no && d.uid && d.data)
      this.__on_msg(d.uid, d.type, d.no, d.count, d.data);
    else if (d && d.type == "transactionError" && d.error)
      this.on_msg_callback(d.type, d);
    // TODO: we're bypassing __on_msg() here due to different msg format, but that means we can't (in the future) use msgtype_waits for transactionError. change the format to the same (use sendSplitMsg() in FCM) in the future and stop treating them differently here.
    else
      LogUtilities.toDebugScreen(
        `unknown FCM message type (bg:${frombg}):`,
        msg
      );
  }

  registerEthereumAddress(checksumAddress: any) {
    this.__sendMessage("address_register", { address: checksumAddress });
  }

  resyncWallet(checksumAddress: any) {
    this.__sendMessage("resync_wallet", { address: checksumAddress });
  }

  requestCompoundDaiInfo(checksumAddress: any) {
    this.__sendMessage("cDai_lending_info", { address: checksumAddress });
  }

  requestPoolTogetherDaiInfo(checksumAddress: any) {
    this.__sendMessage("pool_together_DAI_info", { address: checksumAddress });
  }

  requestUniswapV2WETHxDAIReserves() {
    this.__sendMessage("uniswapV2_WETHxDAI_reserve");
  }

  checkForUpdates(
    checksumAddress: any,
    checksums: any,
    count: any,
    offset = 0
  ) {
    this.__sendMessage("request_updates", {
      address: checksumAddress,
      sums: checksums.join(","),
      items: count.toString(),
      offset: offset.toString(),
      v: storage.temporary_since_you_wont_add_build_number_i_will.toString()
    });
  }
}

export const FcmMsgs = new FCMMsgs("", "");

export const handler: any = (x: any, frombg: any) =>
  FcmMsgs.__fcm_msg(x, frombg);

export const registerHandler = () => {
  LogUtilities.toDebugScreen("FCM registerHandler called");
  firebase.messaging().onMessage(handler);
};
