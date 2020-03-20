'use strict';
import firebase from 'react-native-firebase';
import LogUtilities from '../utilities/LogUtilities.js';
import RNReactNativeZlib from '@klarna/react-native-zlib';

const GlobalConfig = require('../config.json');


function obj_property_default(obj, prop, def) {
	if (obj.hasOwnProperty(prop))
			return obj[prop];
	obj[prop] = def;

	return def;
}
/*
'!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ'
>>> len(x)
187
*/

const base128_chrs = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ'.split('').map(x => x.charCodeAt(0));
const base128_chrtobyte = (() => { let ret = {}; base128_chrs.map((v, idx) => ret[v] = idx); return ret; })();

class ruBase128 {
	static toBase128(buf) {
		if (buf.length == 0)
			return '';

		let ret = new Buffer.allocUnsafe(buf.length + Math.ceil(buf.length / 7));
		let reti = 0;

		let carry = 0;
		let ncarry;

		for (let i = 0; i < buf.length; ++i) {
			const c = buf[i];
			switch (i % 7) {
				//case 7: ncarry = (c & 0x01) << 6; ret[reti] = carry; reti++; ret[reti] = c >> 1; break;
				case 6: ncarry = 0;             ret[reti++] = base128_chrs[carry | (c >> 7)]; ret[reti] = base128_chrs[c & 0x7f]; break;
				case 5: ncarry = (c & 0x3f) << 1; ret[reti] = base128_chrs[carry | (c >> 6)]; break;
				case 4: ncarry = (c & 0x1f) << 2; ret[reti] = base128_chrs[carry | (c >> 5)]; break;
				case 3: ncarry = (c & 0x0f) << 3; ret[reti] = base128_chrs[carry | (c >> 4)]; break;
				case 2: ncarry = (c & 0x07) << 4; ret[reti] = base128_chrs[carry | (c >> 3)]; break;
				case 1: ncarry = (c & 0x03) << 5; ret[reti] = base128_chrs[carry | (c >> 2)]; break; // carry 2 bits
				case 0: ncarry = (c & 0x01) << 6; ret[reti] = base128_chrs[c >> 1]; break; // carry 1 bit
			}

			reti++;

			carry = ncarry;
		}
		ret[reti] = base128_chrs[carry];

		return ret.toString('latin1');
	}

	static fromBase128(str) {
		str = Buffer.from(str, 'latin1');

		let ret = new Buffer.allocUnsafe(Math.floor(str.length * 7 / 8));
		let reti = 0;
		for (let i = 0; i < str.length; ++i) {
			const c = base128_chrtobyte[str[i]];
			const c1 = base128_chrtobyte[str[i+1]];

			switch (i % 8) {
				case 0: ret[reti] = ((c & 0xff) << 1) | (c1 >> 6); break;
				case 1: ret[reti] = ((c & 0x3f) << 2) | (c1 >> 5); break;
				case 2: ret[reti] = ((c & 0x1f) << 3) | (c1 >> 4); break;
				case 3: ret[reti] = ((c & 0x0f) << 4) | (c1 >> 3); break;
				case 4: ret[reti] = ((c & 0x07) << 5) | (c1 >> 2); break;
				case 5: ret[reti] = ((c & 0x03) << 6) | (c1 >> 1); break;
				case 6: ret[reti] = ((c & 0x01) << 7) | (c1); i++; break;
				case 7: ret[reti] = c << 1; break;
			}

			reti++;
		}

		return ret;
	}
}



const msgtype_compressed = {
	'txhistory': false,
	'txstate': false
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
		LogUtilities.toDebugScreen(`MSG addPart, id:${this.id}, num:${num}, have:${this.have}+1/${this.count}`);
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
			throw new Error(".getMessage() for an incomplete message");

		if (!this.compressed)
			call(this.data.join(''));

		RNReactNativeZlib.inflate(ruBase128.fromBase128(this.data.join(''))).then(x => {
			call(x);
		});

		// lzma.decompress(ruBase128.fromBase128(this.data.join('')), (result, error) => {
		// 	if (result)
		// 		call(result);
		//
		// 	throw new Error(error);
		// });

		// lzma.decompress(ruBase128.fromBase128(this.data.join('')), call);
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
			msg = new Msg(id, count, type);

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

			msg.getMessage(msg => {
				const result = JSON.parse(msg);
				if (this.msgtype_waits.hasOwnProperty(type)) {
					this.msgtype_waits[type].forEach((x) => x.resolve(result));
					delete this.msgtype_waits[type];
				}
				else
					this.on_msg_callback(type, result);
			});
		}
	}

	__fcm_msg(msg, frombg) {
		const d = msg._data;

		if (frombg && d && d.type && d.count && d.no && d.uid && d.data)
			LogUtilities.toDebugScreen(`BG message: uid:${d.uid} type:${d.type} no/cnt:${d.no}/${d.count}`);

		if (d && d.type && d.count && d.no && d.uid && d.data)
			this.__on_msg(d.uid, d.type, d.no, d.count, d.data);
		else
			LogUtilities.toDebugScreen(`unknown FCM message type (bg:${frombg}):`, msg);
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
const handler = (x, frombg) => instance.__fcm_msg(x, frombg);

function registerHandler() {
	LogUtilities.toDebugScreen('FCM registerHandler called');
	firebase.messaging().onMessage(handler);
	firebase.messaging().stupid_shit_initialized();
}

module.exports = {
	registerHandler: registerHandler,
	downstreamMessageHandler: x => handler,
	FCMMsgs: instance
}
