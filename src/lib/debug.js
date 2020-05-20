// 'use strict';
// import LogUtilities from '../utilities/LogUtilities';
// import AsyncStorage from '@react-native-community/async-storage';
// import TxStorage from './tx';
// import { FCMMsgs } from './fcm';

// const vm = require('vm');
// class TemporaryDebugConnector_TotallyRemoveItLater_And_Definitely_Do_Not_Ship_It {
// 	constructor () {
// 		this.autoreconnect = true;
// 		this.sock = null;
// 		this.reconn_delay = 10;
// 		this.reconnect();

// 		this.vmContext = {
// 			storage: TxStorage.storage,
// 			AsyncStorage,
// 			LogUtilities,
// 			FCMMsgs
// 		};
// 		vm.createContext(this.vmContext);
// 	}

// 	reconnect() {
// 		if (this.sock)
// 			this.sock.close();

// 		this.sock = new WebSocket('ws://192.168.1.3:54380/');

// 		this.sock.onopen = () => {
// 			this.reconn_delay = 10;
// 			try {
// 				this.send('hello', TxStorage.storage.getOwnAddress());
// 			}
// 			catch (e) {
// 				console.error(e.toString());
// 				this.sock.close();
// 			}
// 		}

// 		this.sock.onclose = () => {
// 			this.reconn_delay *= 1.1;
// 			if (this.reconn_delay > 20 * 60)
// 				this.reconn_delay = 20 * 60;

// 			if (this.autoreconnect)
// 				setTimeout(() => { this.reconnect(); }, this.reconn_delay * 1000);
// 		}

// 		this.sock.onerror = () => {
// 			this.sock.close();
// 		}

// 		this.sock.onmessage = this.message.bind(this);
// 	}

// 	send() {
// 		try {
// 			if (this.sock.readyState == WebSocket.OPEN)
// 				this.sock.send(JSON.stringify(Array.from(arguments)));
// 		}
// 		catch (e) {
// 			this.sock.close();
// 		}
// 	}

// 	message(msg) {
// 		try {
// 			const d = JSON.parse(msg.data);
// 			if (!(d instanceof Array))
// 				throw new Error('received nonarray in JSON');

// 			switch (d[0]) {
// 				case 'quit':
// 					this.send(d, 'quitting!');

// 					this.autoreconnect = false;
// 					this.sock.close();
// 					break;

// 				case 'storage':
// 					this.send(d, TxStorage.storage);
// 					break;

// 				case 'sget':
// 					AsyncStorage.getItem(d[1]).then(x => {
// 						this.send(d, x);
// 					});
// 					break;

// 				case 'sset':
// 					AsyncStorage.setItem(d[1], d[2]).then(() => {
// 						this.send(d, 'done');
// 					});
// 					break;

// 				case 'sdel':
// 				case 'srem':
// 					AsyncStorage.removeItem(d[1]).then(() => {
// 						this.send(d, 'done');
// 					});
// 					break;

// 				case 'slist':
// 					AsyncStorage.getAllKeys().then(x => {
// 						this.send(d, x);
// 					});
// 					break;

// 				case 'sverify':
// 					AsyncStorage.getAllKeys().then(keys => {
// 						const keymap = {};
// 						keys.forEach(x => keymap[x] = true);
// 					});
// 					// TODO: go through each filter index and check if given keys exist.
// 					break;

// 				case 'sdroplast':
// 					// get last d[1] txes from 'all', remove from all the indexes (and from the storage)
// 					break;

// 				case 'sdump':
// 					AsyncStorage.getAllKeys().then(x => {
// 						AsyncStorage.multiGet(x).then(x => {
// 							const ret = {};
// 							x.forEach(([k, v]) => ret[k] = v);
// 							this.send(d, ret);
// 						});
// 					});
// 					break;

// 				case 'sload':
// 					AsyncStorage.multiSet(Object.entries(d[1])).then(() => {
// 						this.send(d, 'done');
// 					});
// 					break;

// 				case 'schecksums':
// 					TxStorage.storage.getVerificationData().then(x => {
// 						this.send(d, x);
// 					});
// 					break;

// 				case 'vm':
// 					const ret = vm.runInContext(d[1], this.vmContext);
// 					this.send(d, ret, this.vmContext);
// 					break;

// 				default:
// 					this.send(d, 'received unknown cmd');
// 			}

// 		}
// 		catch (e) {
// 			this.send(e.toString());
// 			this.sock.close();
// 		}
// 	}
// }

// module.exports.TemporaryDebugConnector_TotallyRemoveItLater_And_Definitely_Do_Not_Ship_It = new TemporaryDebugConnector_TotallyRemoveItLater_And_Definitely_Do_Not_Ship_It();
