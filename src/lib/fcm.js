'use strict';
import firebase from 'react-native-firebase';
const GlobalConfig = require('../config.json');

function obj_property_default(obj, prop, def) {
	if (obj.hasOwnProperty(prop))
			return obj[prop];
	obj[prop] = def;

	return def;
}

class Msg {
	constructor(id, count) {
		this.data = [];
		this.count = count;
		this.have = 0;
		this.id = id;
	}

	addPart(num, data) {
		if (this.data[num])
			throw new Error(`duplicate part ${num} for message batch id ${this.id}`);

		this.data[num] = data;
		this.have++;

		return this;
	}

	isComplete() {
		return this.have == this.count;
	}

	getMessage() {
		return this.data.join();
	}
}


class FCMMsgs {
	constructor(on_msg_callback, on_msg_timeout, timeoutsecs=30) {
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
        return `m${this.msgid_time}`;
	}

	__sendMessage(type, otherData={}) {
		const upstreamMessage = new firebase.messaging.RemoteMessage()
		  .setMessageId(this.__gen_msg_id())
		  .setTo(GlobalConfig.FCM_server_address)
		  .setData({
			type: type,
			...otherData
		  });

		firebase.messaging().sendMessage(upstreamMessage);
	  }


	__on_msg(id, type, num, count, data) {
		let msg;

		if (!this.msgs[id]) {
			msg = new Msg(id, count);

			this.msgs[id] = msg;

			if (count > 1 && this.on_msg_timeout)
				this.tos[id] = setTimeout(() => {
					this.on_msg_timeout(msg);
				}, this.timeout);
			// TODO: remove msgs[id] and tos[id] on timeout?
		}
		else
			msg = this.msgs[id];

		msg.addPart(num, data);

		if (msg.isComplete()) {
			if (this.tos[id]) {
				cancelTimeout(this.tos[id]);
				delete this.tos[id];
			}
			delete this.msgs[id];

			let result = JSON.parse(msg.getMessage());
			if (this.msgtype_waits.hasOwnProperty(type)) {
				this.msgtype_waits[type].forEach((x) => x.resolve(result));
				delete this.msgtype_waits[type];
			}
			else
				this.on_msg_callback(type, result);
		}
	}

	registerEthereumAddress(checksumAddress) {
		this.__sendMessage('address_register', { address: checksumAddress });
	}

	resyncTransactions(checksumAddress) {
		this.__sendMessage('resync_transactions', { address: checksumAddress });
	}

	requestCDaiLendingInfo(checksumAddress) {
		this.__sendMessage('cDai_lending_info', { address: checksumAddress });
	}

	requestUniswapETHDAIBalances() {
		this.__sendMessage('uniswap_ETHDAI_info');
	}

	checkForUpdates(checksumAddress, lastConfirmedTstamp) {
		this.__sendMessage('request_updates', { address: checksumAddress, lastTstamp: lastConfirmedTstamp });
	}

	sendTx(rawTx) {

	}

}

const instance = new FCMMsgs();

function registerHandler() {
	firebase.messaging().onMessage(instance.__on_msg);
	firebase.messaging().stupid_shit_initialized();
  }

  module.exports = {
	registerHandler: registerHandler,
	downstreamMessageHandler: instance.__on_msg,
	FCMMsgs: instance
  }
