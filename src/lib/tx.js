'use strict';

import LogUtilities from '../utilities/LogUtilities';
import AsyncStorage from '@react-native-community/async-storage';

const GlobalConfig = require('../config.json');

// TODO: since confirmed txes are kind of set in stone, we could actually store arrays of sorted
// txes, by timestamps for example. __txbytime_0: [hash1, hash2, hash3, hash4 .. hash20]
// __txbytime_1: [hash21, hash22, hash23, ... hash40]
// just remember the last number n and we know it's __txbytime_1 .. __txbytime_n

// ========== consts ==========
const TxStates = {
	STATE_ERROR: -1,
	STATE_NEW: 0,
	STATE_PENDING: 1,
	STATE_INCLUDED: 2,
	STATE_CONFIRMED: 3,
};

const TxTokenOpTypeToName = { // names inside txhistory object
	transfer: 'tr',
	approval: 'appr',
	failure: 'failure',
	mint: 'mint',
	redeem: 'redeem',
	eth2tok: 'eth2tok',
	tok2eth: 'tok2eth'
};


// ========== helper functions ==========
function dropHexPrefix(hex) {
	return typeof hex === 'string' ? (hex.startsWith('0x') ? hex.substr(2) : hex) : hex;
}
function hexToBuf(hex) {
	return typeof hex === 'string' ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex') : null;
}


// ========== storage abstraction ==========
/*
	'_TX' is prefix

	_TXcount: count of all txes
	_TX_[id]: incrementing unique id (probably base64 of .count?) that stores a tx. to make it short-ish.
	_TXidx[num]: num from 0 contains oldest txes, highest num - newest. lets keep, say, 60 txes per bucket? bucket with given tx is gonna be just (id // tx_count_per_bucket)

	or perhaps actually use
	_TX_[txhash]: so that lookup is easy
	_TXidx[num] stores hashes of sorted txes (by timestamp), like above.
	_TXidx_Dai[num]: could be like above but for txes that match the dai filter criteria, etc.

*/

/* actually txhash has to be stored anyway, so why not just go
	${prefix}_${hash} for txdata
	${prefix}iall${num} for buckets
	${prefix}iallc for count
	${prefix}i${indexname}${num} for buckets again
	${prefix}i${indexname}c for count in given index

	hashes in buckets are always sorted by timestamp
*/

const storage_bucket_size = 64;
class PersistTxStorageAbstraction {
	constructor(prefix='') {
		LogUtilities.toDebugScreen('PersistTxStorageAbstraction constructor called');

		this.cache = {};
		this.counts = {};
		this.filters = {};

		this.prefix = prefix; // `${this.prefix}${key}`

		/*
		this._tempwritetimer = null;
		AsyncStorage.getItem(`${this.prefix}_temp`).then(x => {
			this.storage = {};

			if (x != null) {
				Object.entries(JSON.parse(x)).forEach(([hash, data]) => {
					const tx = new Tx(data[7]).setHash(hash).fromDataArray(data, false);
					this.storage[hash] = tx;
					if (onTxLoadCallback)
						onTxLoadCallback(tx);
				});
			}

			if (onTxLoadCallback)
				onTxLoadCallback();
		});
		*/
	}

	init_storage(name_to_filter_map, init_finish_callback) {
		let load_count = 0;

		const loadCount = (function(name) {
			load_count++;
			AsyncStorage.getItem(`${this.prefix}i${name}c`).then(x => {
				this.counts[name] = x ? parseInt(x) : 0;
				load_count--;
				if (load_count == 0 && init_finish_callback) {
					LogUtilities.toDebugScreen(`PersistTxStorageAbstraction init_storage(): tasks executed. counts:${JSON.stringify(this.counts)}`);
					init_finish_callback();
				}
			});
		}).bind(this);

		loadCount('all');

		Object.entries(name_to_filter_map).forEach(([name, filter]) => {
			this.filters[name] = filter;
			loadCount(name);
		});
	}

	async __getKey(k, processfunc) {
		// TODO: needs cache cleaning
		if (!this.cache[k]) {
			const val = await AsyncStorage.getItem(k);
			this.cache[k] = processfunc ? processfunc(val) : val;
		}

		return this.cache[k];
	}

	async __setKey(k, v, processfunc) {
		this.cache[k] = v;

		await AsyncStorage.setItem(k, processfunc ? processfunc(v) : v);
	}

	async __removeKey(k) {
		delete this.cache[k];

		await AsyncStorage.removeItem(k);
	}

	__decodeBucket(b) {
		return b.split(',');
	}
	__encodeBucket(ba) {
		return ba.join(',');
	}

	async getTxByNum(num, index='all') {
		const bucket_num = Math.floor(num / storage_bucket_size);
		const bucket_pos = num % storage_bucket_size;

		const bucket = await this.__getKey(`${this.prefix}i${index}${bucket_num}`, this.__decodeBucket);
		return await this.getTxByHash(bucket[bucket_pos]);
	}

	async getTxByHash(hash) {
		return await this.__getKey(`${this.prefix}_${hash}`, (data) => { if (!data) return null; data = JSON.parse(data); return new Tx(data[7]).setHash(hash).fromDataArray(data, false); });
	}

	async appendTx(hash, tx) {
		// run filters to see which indices this goes in. for each index, append to the last bucket (make sure we create a new one if it spills)
		let append_indices = ['all'];
		Object.entries(this.filters).forEach(([index, filterfunc]) => {
			if (filterfunc(tx))
				append_indices.push(index);
		});

		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(hash:${hash}, tx:${JSON.stringify(tx)}): append_indices:${append_indices.join()}`);

		let tasks = [this.__setKey(`${this.prefix}_${hash}`, tx, JSON.stringify)];
		append_indices.forEach(x => {
			const bucket_num = Math.floor(this.counts[x] / storage_bucket_size);
			if (this.counts[x] % storage_bucket_size == 0) { // new bucket
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(): index:${x} item_num:${this.counts[x]} new bucket, bucket_num:${bucket_num}`);
				tasks.push(this.__setKey(`${this.prefix}i${x}${bucket_num}`, [hash], this.__encodeBucket));
			}
			else { // add to bucket
				/*
				let bucket = this.__decodeBucket(await this.__getKey(`${this.prefix}i${x}${bucket_num}`));
				bucket.push(hash);
				tasks.push(this.__setKey(`${this.prefix}i${x}${bucket_num}`, this.__encodeBucket(bucket)));
				*/
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(): index:${x} item_num:${this.counts[x]} bucket_num:${bucket_num}`);
				tasks.push(this.__getKey(`${this.prefix}i${x}${bucket_num}`, this.__decodeBucket).then(async x => { x.push(hash); await this.__setKey(`${this.prefix}i${x}${bucket_num}`, x, this.__encodeBucket); }));
			}

			this.counts[x]++;
			tasks.push(this.__setKey(`${this.prefix}i${x}c`, this.counts[x].toString()));
		});

		await Promise.all(tasks);

	}

	async bulkLoad(txarray) {
		var index_counts = {
			'all': 0
		}
		var index_buckets = {
			'all': []
		}

		const startTime = Date.now();

		function add_to_index(index, hash) {
			const buck = index_buckets[index];
			if (index_counts[index] % storage_bucket_size == 0)
				buck.push([hash]);
			else
				buck[buck.length - 1].push(hash);

			index_counts[index]++;
		}

		Object.keys(this.filters).forEach(index => { index_counts[index] = 0; index_buckets[index] = []; });

		let tasks = [];
		txarray.forEach((tx) => {
			const hash = tx.getHash();
			add_to_index('all', hash);

			Object.entries(this.filters).forEach(([index, filterfunc]) => { if (filterfunc(tx)) add_to_index(index, hash); });

			tasks.push([`${this.prefix}_${hash}`, JSON.stringify(tx)]);
		});

		Object.entries(index_counts).forEach(([index, count]) => {
			tasks.push([`${this.prefix}i${index}c`, count.toString()]);
		});

		Object.entries(index_buckets).forEach(([index, buckets]) => {
			buckets.forEach((bucket, idx) => {
				tasks.push([`${this.prefix}i${index}${idx}`, this.__encodeBucket(bucket)]);
			});
		});

		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction bulkLoad(): tasks to execute:${tasks.length}, index counts:${JSON.stringify(index_counts)}`);

		await AsyncStorage.multiSet(tasks);

		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction bulkLoad(): tasks executed. load time:${Date.now() - startTime}ms`);
	}

	async wipe() {
		let indices = Object.keys(this.filters);
		let removekeys = [];

		indices.forEach(x => {
			for (let i = 0; i < Math.ceil(this.counts[x] / storage_bucket_size); ++i)
				removekeys.push(`${this.prefix}i${x}${i}`); //tasks.push(AsyncStorage.removeItem(`${this.prefix}i${x}${i}`)); // remove buckets

			removekeys.push(`${this.prefix}i${x}c`); //tasks.push(AsyncStorage.removeItem(`${this.prefix}i${x}c`)); // and the count
		});

		// now we only have index `all' to go through, but we actually need to read it and remove all hashes
		let readtasks = [];
		removekeys.push(`${this.prefix}iallc`); // tasks.push(AsyncStorage.removeItem(`${this.prefix}iallc`));
		for (let i = 0; i < Math.ceil(this.counts.all / storage_bucket_size); ++i) {
			removekeys.push(`${this.prefix}iall${i}`); // tasks.push(AsyncStorage.removeItem(`${this.prefix}iall${i}`));
			readtasks.push(this.__getKey(`${this.prefix}iall${i}`, this.__decodeBucket).then(bucket => {
				bucket.forEach(x =>
					removekeys.push(`${this.prefix}_${x}`) // tasks.push(AsyncStorage.removeItem(`${this.prefix}_${x}`))
				);
			}));
		}
		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction wipe(): readtasks to execute:${readtasks.length}, index counts:${JSON.stringify(this.counts)}`);
		await Promise.all(readtasks); // first we run readtasks to make sure we've processed all the buckets, this should also fill tasks with removes.
		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction wipe(): remove tasks to execute:${removekeys.length}`);
		await AsyncStorage.multiRemove(removekeys); // aand we removed everything now.

		Object.keys(this.counts).forEach(x => this.counts[x] = 0);
		this.cache = {};
	}

	getItemCount(index='all') {
		return this.counts[index];
	}

	async __replaceKeyInIndex(oldkey, newkey, index='all') {
		let bucket_count = Math.ceil(this.counts[index] / storage_bucket_size) - 1; // not exactly count, more like index and those go from 0

		while (bucket_count >= 0) {
			let bucket = await this.__getKey(`${this.prefix}i${index}${bucket_count}`, this.__decodeBucket);
			let pos = bucket.indexOf(oldkey);
			if (pos >= 0) {
				bucket[pos] = newkey;
				await this.__setKey(`${this.prefix}i${index}${bucket_count}`, bucket, this.__encodeBucket);
				return;
			}

			bucket_count--;
		}
		throw new Error(`key "${oldkey}" not found in the index "${index}"`);
	}

	async removeKey(oldkey, index='all') {
		// TODO: this'll have to rewrite all the buckets...
		throw new Error("not implemented yet");
		let bucket_count = Math.ceil(this.counts[index] / storage_bucket_size) - 1; // not exactly count, more like index and those go from 0

		while (bucket_count >= 0) {
			let bucket = await this.__getKey(`${this.prefix}i${index}${bucket_count}`);
			let pos = bucket.indexOf(oldkey);
			if (pos >= 0) {
				// TODO.

				return;
			}

			bucket_count--;
		}
		throw new Error(`key "${oldkey}" not found in the index "${index}"`);
	}

	__indexDiff(oldtx, newtx) {
		let ret = {
			'common': [],
			'add': [],
			'remove': []
		};

		let oldidx = {};
		Object.entries(this.filters).forEach(([index, filterfunc]) => {
			if (filterfunc(oldtx))
				oldidx[index] = 1;
		});

		Object.entries(this.filters).forEach(([index, filterfunc]) => {
			if (filterfunc(newtx)) {
				if (oldidx[index]) {
					oldidx[index] = 0;
					ret.common.push(index);
				}
				else
					ret.add.push(index);
			}
		});

		Object.entries(oldidx).forEach(([index, x]) => {
			if (x)
				ret.remove.push(index);
		});

		return ret;
	}

	async replaceTx(oldtx, newtx, oldhash, newhash) {
		// let indexDiff = this.__indexDiff(oldtx, newtx);
		// TODO: index differences disregarded for now.

		await this.__setKey(`${this.prefix}_${newhash}`, newtx, JSON.stringify);
		await this.__removeKey(`${this.prefix}_${oldhash}`);

		await Promise.all([this.__replaceKeyInIndex(oldhash, newhash, 'all')].concat(Object.entries(this.filters).map(([index, filterfunc]) => {
			if (filterfunc(newtx))
				return this.__replaceKeyInIndex(oldhash, newhash, index);
		})));

		// throw new Error("not implemented yet");
	}

	async updateTx(oldtx, newtx, hash) {
		// let indexDiff = this.__indexDiff(oldtx, newtx);

		// TODO: index differences disregarded for now.

		await this.__setKey(`${this.prefix}_${hash}`, newtx, JSON.stringify);

		//throw new Error("not implemented yet");
	}
}

// ========== exceptions ==========
class TxException extends Error {
	constructor(msg) {
		super(msg);
		this.name = this.constructor.name;
	}
}

class NoSuchTxException extends TxException {}
class InvalidStateTxException extends TxException {}
class DuplicateNonceTxException extends TxException {}
class DuplicateHashTxException extends TxException {}


// ========== token operations ==========
// TODO: replace these with a factory

class TxTokenOp {

	/*toJSON() {
		return this.constructor.name;
	}*/

	freeze() {
		Object.freeze(this);
		return this;
	}

	deepClone() {
		return Object.assign(new this.constructor([]), this);
	}
}
class TxTokenMintOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.minter, this.mintUnderlying, this.mintAmount] = arr;
		// this.minter = arr[0]; this.mintAmount = arr[1]; this.mintUnderlying = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.mint]: [this.minter, this.mintUnderlying, this.mintAmount] };
	}
}
class TxTokenRedeemOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.redeemer, this.redeemUnderlying, this.redeemAmount] = arr;
		// this.redeemer = arr[0]; this.redeemAmount = arr[1]; this.redeemUnderlying = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.redeem]: [this.redeemer, this.redeemUnderlying, this.redeemAmount] };
	}
}
class TxTokenTransferOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.from_addr, this.to_addr, this.amount] = arr;
		// this.from_addr = arr[0]; this.to_addr = arr[1]; this.amount = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.transfer]: [this.from_addr, this.to_addr, this.amount] };
	}
}
class TxTokenApproveOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.spender, this.approver, this.amount] = arr;
		// this.approver = arr[0]; this.spender = arr[1]; this.amount = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.approval]: [this.spender, this.approver, this.amount] };
	}
}
class TxTokenFailureOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.error, this.info, this.detail] = arr;
		// this.error = arr[0]; this.info = arr[1]; this.detail = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.failure]: [this.error, this.info, this.detail] };
	}
}
class TxTokenEth2TokOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.from_addr, this.eth_sold, this.tok_bought] = arr;
		// this.from_addr = arr[0]; this.eth_sold = arr[1]; this.tok_bought = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.eth2tok]: [this.from_addr, this.eth_sold, this.tok_bought] };
	}
}
class TxTokenTok2EthOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.from_addr, this.tok_sold, this.eth_bought] = arr;
		// this.from_addr = arr[0]; this.tok_sold = arr[1]; this.eth_bought = arr[2];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.tok2eth]: [this.from_addr, this.tok_sold, this.eth_bought] };
	}
}
/*
function createTxOpClass(fieldlist) {
	let cls = function(arr) {
		super();

	}
	return class extends TxTokenOp {
		constructor(arr) {
			super();
			let i = 0;
			fieldlist.forEach(x => {
				this[x] = arr[i++];
			});
		}

		toJSON() {
			return
		}
	}
}
*/

// ========== actual transaction data storage class ==========
const TxTokenOpNameToClass = { // name -> tokenop storage class
	[TxTokenOpTypeToName.transfer]: TxTokenTransferOp,
	[TxTokenOpTypeToName.approval]: TxTokenApproveOp,
	[TxTokenOpTypeToName.failure]: TxTokenFailureOp,
	[TxTokenOpTypeToName.mint]: TxTokenMintOp,
	[TxTokenOpTypeToName.redeem]: TxTokenRedeemOp,
	[TxTokenOpTypeToName.eth2tok]: TxTokenEth2TokOp,
	[TxTokenOpTypeToName.tok2eth]: TxTokenTok2EthOp
}

class Tx {
	constructor(state) {
		this.from_addr = this.to_addr = this.value = this.gas = this.gasPrice = this.timestamp = this.nonce = this.hash = null;
		this.state = state !== undefined ? state : null;
		this.tokenData = {};
	}

	setFrom(addr) {
		this.from_addr = hexToBuf(addr);
		return this;
	}

	setTo(addr) {
		this.to_addr = hexToBuf(addr);
		return this;
	}

	setHash(hash) {
		//this.hash = hexToBuf(hash);
		this.hash = hash;
		return this;
	}

	setNonce(nonce) {
		this.nonce = nonce;
		return this;
	}

	setValue(value) {
		this.value = value;
		return this;
	}

	setGas(value) {
		this.gas = value;
		return this;
	}

	setGasPrice(value) {
		this.gasPrice = value;
		return this;
	}

	setTimestamp(tstamp) {
		this.timestamp = tstamp;
		return this;
	}

	setState(state) {
		this.state = state;
		return this;
	}

	tempSetData(data) {
		this.data = data;
		return this;
	}

	upgradeState(new_state, new_timestamp) { // updates state and timestamp ONLY if the new state is a later state (so, we cant go back from confirmed to included, for example)
		if (new_state >= this.state) {
			this.state = new_state;
			this.timestamp = new_timestamp;
		}
		// else ignore downgrade attempts, not an error

		return this;
	}

	fromDataArray(data, fromFCM=true) {
		this.tokenData = {};

		if (data.length > 8) { // we have token data.
			if (fromFCM)
				Object.entries(data[8]).forEach(
					([token, ops]) => Object.entries(ops).forEach(
						([op, opdata]) => opdata.forEach(
							(opdata) => this.addTokenOperation(token, op, opdata.map(x => dropHexPrefix(x)))
						)
					)
				);
			else {
				Object.entries(data[8]).forEach(
					([token, ops]) => ops.forEach(
						opdescr => Object.entries(opdescr).forEach(
							([op, opdata]) => this.addTokenOperation(token, op, opdata.map(x => dropHexPrefix(x)))
						)
					)
				);
			}
		}

		return this.setFrom(data[0])
			.setTo(data[1])
			.setGas(dropHexPrefix(data[2]))
			.setGasPrice(dropHexPrefix(data[3]))
			.setValue(dropHexPrefix(data[4]))
			.setNonce(typeof data[5] === 'string' ? parseInt(data[5]) : data[5])
			.upgradeState(data[7], data[6]);
	}

	addTokenOperation(token, operation, data) {
		if (this.tokenData.hasOwnProperty(token))
			this.tokenData[token].push(new TxTokenOpNameToClass[operation](data));
		else
			this.tokenData[token] = [new TxTokenOpNameToClass[operation](data)];

		return this;
	}

	hasTokenOperations(token) {
		return this.tokenData.hasOwnProperty(token);
	}

	hasTokenOperation(token, operation) { // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
		if (!this.tokenData.hasOwnProperty(token))
			return false;

		const cls = TxTokenOpNameToClass[operation];
		return this.tokenData[token].some((x) => x instanceof cls);
	}

	getTokenOperations(token, operation) { // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
		if (!this.tokenData.hasOwnProperty(token))
			return [];

		const cls = operation ? TxTokenOpNameToClass[operation] : null;
		return this.tokenData[token].filter((x) => (operation == null || x instanceof cls));
	}

	getFrom() {
		return this.from_addr ? `0x${this.from_addr.toString('hex')}` : null;
	}

	getTo() {
		return this.to_addr ? `0x${this.to_addr.toString('hex')}` : null;
	}

	getHash() {
		//return this.hash ? this.hash.toString('hex') : null;
		return this.hash;
	}

	getState() {
		return this.state;
	}

	getValue() {
		return this.value ? this.value : 0;
	}

	getTimestamp() {
		return this.timestamp;
	}

	getNonce() {
		return this.nonce;
	}

	toTransactionDict() {
		return {
			nonce: `0x${this.nonce.toString(16)}`,
			to: this.getTo(),
			gasPrice: `0x${this.gasPrice}`,
			gasLimit: `0x${this.gas}`,
			value: `0x${this.getValue()}`,
			chainId: GlobalConfig.network_id,
			data: this.data
		  };
	}

	toJSON() {
		return [this.getFrom(), this.getTo(), this.gas, this.gasPrice, this.value, this.nonce, this.timestamp, this.state, this.tokenData];
	}

	shallowClone() {
		/*let newtx = new Tx(this.state);
		Object.entries(this).forEach(([k, v]) => if (typeof v !== 'function') newtx[k] = v; );
		return newtx;*/
		return Object.assign(new Tx(), this);
	}

	deepClone() {
		let ntx = Object.assign(new Tx(), this);
		ntx.tokenData = Object.assign({}, ntx.tokenData);
		for (let n of Object.getOwnPropertyNames(ntx.tokenData))
			ntx.tokenData[n] = ntx.tokenData[n].map(x => x.deepClone());

		return ntx;
	}

	freeze() {
		for (let n of Object.getOwnPropertyNames(this.tokenData)) {
			this.tokenData[n].forEach(x => x.freeze());
			Object.freeze(this.tokenData[n]);
		}
		Object.freeze(this.tokenData);
		Object.freeze(this);

		return this;
	}
}


// ========== storage class for all transactions ==========
// this is the one we instantiate (once) to use the TX data in storage.
// import React, { Component } from 'react'; - not needed without the wrapper.
const maxNonceKey = '_tx[maxnonce]';
class TxStorage {
	constructor (ourAddress) {
		let load_promises = [];
		let promise_resolves = [];
		let promise_rejects = []; // if i ever implement this

		[0, 1].forEach(() => {
			load_promises.push(new Promise((res, rej) => {
				promise_resolves.push(res);
				promise_rejects.push(rej);
			}));
		});

		this.onload_promise = Promise.all(load_promises);

		LogUtilities.toDebugScreen('TxStorage constructor called');
		this.our_max_nonce = -1; // for our txes

		AsyncStorage.getItem(maxNonceKey).then(x => {
				this.our_max_nonce = parseInt(x);
				promise_resolves[1]();
				LogUtilities.toDebugScreen(`MaxNonce: ${this.our_max_nonce}`);
		});

		this.txes = new PersistTxStorageAbstraction('tx_');

		this.txes.init_storage({
			'dai': this.txfilter_isRelevantToDai
		}, (x) => { if (x === undefined) promise_resolves[0](); })

		if (ourAddress)
			this.our_address = hexToBuf(ourAddress);
		else
			this.our_address = null;

		this.on_update = [];

		// AsyncStorage.getAllKeys().then(x => {
		// 	LogUtilities.toDebugScreen(`AStor keys: ${x}`);
		// });
	}

	isStorageReady() {
		return this.onload_promise;
	}

	// wrap(wrapped, storagepropname) {
	// 	const __storage = this;

	// 	return class DurexComponentWrapper extends Component {
	// 		constructor(props) {
	// 			super(props);

	// 			this.storagepropname = storagepropname;
	// 			this.wrapped = wrapped;
	// 			this.storage = __storage;
	// 			this.__mounted = false;

	// 			this.state = {
	// 				txstorage: null
	// 			};
	// 		}

	// 		subNewTransactions(tx) {
	// 			if (this.__mounted && tx !== this.state.txstorage)
	// 				this.setState({
	// 					txstorage: tx
	// 				});
	// 		}

	// 		componentDidMount() {
	// 			this.__mounted = true;
	// 			this.unsub = this.storage.subscribe(this);
	// 			this.storage.tempGetAllAsList().then(this.subNewTransactions.bind(this));
	// 		}

	// 		componentWillUnmount() {
	// 			this.__mounted = false;
	// 			this.unsub();
	// 		}

	// 		render() {
	// 			return React.createElement(this.wrapped, { ...this.props, [this.storagepropname]: this.state.txstorage });
	// 		}

	// 	}
	// }

	subscribe(func) {
		this.on_update.push(func);
		return () => { this.unsubscribe(func); };
	}
	unsubscribe(func) {
		this.on_update = this.on_update.filter((x) => x !== func);
		return this;
	}


	setOwnAddress(ourAddress) {
		LogUtilities.toDebugScreen(`TxStorage setOwnAddress(${ourAddress}) called`);
		this.our_address = hexToBuf(ourAddress);
	}

	getOwnAddress() {
		return this.our_address.toString('hex');
	}

	async newTx(state=TxStates.STATE_NEW, nonce) {
		const now = Math.trunc(Date.now() / 1000);
		let tx = new Tx(state)
			.setTimestamp(now)
			.setNonce(nonce ? nonce : await this.getNextNonce());

		tx.from_addr = this.our_address;

		return tx;
	}

	__onUpdate() {
		LogUtilities.toDebugScreen('TxStorage __onUpdate() called');
		try {
			this.on_update.forEach(x => x([]));
		}
		catch (e) {
			LogUtilities.toDebugScreen(`__executeUpdateCallbacks exception: ${e.message} @ ${e.stack}`);
		}
		return this;
	}

	/*
	async saveTx(tx, batch=false) {
		if (!batch)
			LogUtilities.toDebugScreen(`saveTx(batch:${batch}): `, tx);
		if (tx.state >= TxStates.STATE_INCLUDED) { // those already have known hash
			if (await this.included_txes.hasItem(tx.hash))
				throw new DuplicateHashTxException(`tx hash ${tx.hash} already known`);

			if (!tx.hash)
				throw new InvalidStateTxException(`tx state is INCLUDED or later, but no hash set.`)

			await this.included_txes.setItem(tx.hash, tx);

			if (this.txfilter_checkMaxNonce(tx) && !batch)
				await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());

			if (!this._isDAIApprovedForCDAI_cached)
				this._isDAIApprovedForCDAI_cached = undefined;

			if (!batch)
				this.__onUpdate();
		}
		else {
			if (tx.hash)
				throw new InvalidStateTxException(`tx state is not-included, but hash is set.`)

			if (await this.not_included_txes.hasItem(tx.nonce))
				throw new DuplicateNonceTxException(`nonce ${tx.nonce} is already present in a previous not-yet-included transaction`);

			await this.not_included_txes.setItem(tx.nonce, tx);

			if (!batch)
				this.__onUpdate();
		}
	}
	*/

	async getTx(id, index='all') {
		return await this.txes.getTxByNum(id, index);
	}

	getTxCount(index='all') {
		return this.txes.getItemCount(index);
	}


	txfilter_checkMaxNonce(tx) { // not a real filter, but updates our max nonce.
		if (tx.from_addr && tx.nonce > this.our_max_nonce && this.our_address.equals(tx.from_addr)) {
			this.our_max_nonce = tx.nonce;
			return true;
		}

		return false;
	}

	txfilter_isRelevantToDai(tx) {
		if (tx.hasTokenOperations('dai'))
			return true;

		if (tx.hasTokenOperations('cdai'))
			return tx.hasTokenOperation('cdai', TxTokenOpTypeToName.mint) ||
				tx.hasTokenOperation('cdai', TxTokenOpTypeToName.redeem) ||
				tx.hasTokenOperation('cdai', TxTokenOpTypeToName.failure);

		return false;
	}

	async saveTx(tx) { // used now only to save our own sent txes, therefore those wont have anything but the nonce.
		const nonceKey = `nonce_${tx.getNonce()}`;
		await this.txes.appendTx(nonceKey, tx);
		LogUtilities.toDebugScreen(`saveTx(): tx saved (key:${nonceKey}): `, tx);
		if (this.txfilter_checkMaxNonce(tx)) {
			await AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
			LogUtilities.toDebugScreen(`saveTx(): our_max_nonce changed to ${this.our_max_nonce}`);
		}

		this.__onUpdate();
	}

	async parseTxHistory(histObj) {
		LogUtilities.toDebugScreen('TxStorage parseTxHistory() called');
		if (histObj['_contracts'])
			delete histObj['_contracts'];

		histObj = Object.entries(histObj).map(([hash, data]) => new Tx(data[7]).setHash(hash).fromDataArray(data));
		histObj.forEach(tx => this.txfilter_checkMaxNonce(tx));
		histObj.sort((a, b) => a.getTimestamp() - b.getTimestamp());
		await this.txes.bulkLoad(histObj);

		AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
		LogUtilities.toDebugScreen(`parseTxHistory(): our_max_nonce changed to ${this.our_max_nonce}`);

		this.__onUpdate();
	}

	async processTxState(hash, data) {
		LogUtilities.toDebugScreen(`processTxState(hash:${hash}) + `, data);

		let tx = await this.txes.getTxByHash(hash);
		if (tx) { // sounds like state update.
			LogUtilities.toDebugScreen(`processTxState(hash:${hash}) known included+ tx: `, tx);

			let newtx = tx.deepClone();
			// LogUtilities.toDebugScreen(`processTxState(hash:${hash}) deep clone: `, JSON.stringify(newtx));

			if (data[0] != null) // or maybe more ;-) <- careful here, if this causes different filters to match then we're borked.
			 	newtx.fromDataArray(data);
			else
				newtx.upgradeState(data[7], data[6]);

			LogUtilities.toDebugScreen(`processTxState(hash: ${hash}) known included+ tx updated: `, newtx);

			await this.txes.updateTx(tx, newtx, hash);

			this.__onUpdate();
			return;
		}

		// from here on we know it's not a tx we saved by hash

		if (data[0] !== null) { // we have the data, nice
			const ourTx = this.our_address.equals(Buffer.from(data[0], 'hex'));
			const savedState = await AsyncStorage.getItem(`tx_state_${hash}`);
			if (savedState) {
				await AsyncStorage.removeItem(`tx_state_${hash}`);
				LogUtilities.toDebugScreen(`processTxState(hash:${hash}) savedState present: `, savedState);
				savedState = JSON.parse(savedState);
			}

			if (ourTx) { // our tx so find by nonce
				const nonce = typeof data[5] === 'string' ? parseInt(data[5]) : data[5];
				const nonceKey = `nonce_${nonce}`;

				if (nonce > this.our_max_nonce) {
					this.our_max_nonce = nonce;
					await AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
					LogUtilities.toDebugScreen(`processTxState(): our_max_nonce changed to ${this.our_max_nonce}`);
				}

				tx = await this.txes.getTxByHash(nonceKey);
				if (tx) {
					LogUtilities.toDebugScreen(`processTxState(hash:${hash}) known OUR tx by nonce: `, tx);

					let newtx = tx.deepClone();
					// LogUtilities.toDebugScreen(`processTxState(hash:${hash}) deep clone: `, JSON.stringify(newtx));
					newtx.setHash(hash)
						.fromDataArray(data);

					if (savedState)
						newtx.upgradeState(savedState[7], savedState[6]);

					// TODO: update to normal tx (with hash), rename keys, etc.
					await this.txes.replaceTx(tx, newtx, nonceKey, hash);

					LogUtilities.toDebugScreen(`processTxState(hash:${hash}) known OUR tx, promoted: `, newtx);

					this.__onUpdate();
					return;
				}
			}

			// it's a new, not known tx, and we've got the data. just append... and check if it wasn't confirmed yet (savedState)
			tx = new Tx(data[7])
				.setHash(hash)
				.fromDataArray(data);

			// if (savedState) also update state to that, if higher.
			if (savedState)
				tx.upgradeState(savedState[7], savedState[6]);

			LogUtilities.toDebugScreen(`processTxState(hash:${hash}) not known ${ourTx ? "OUR " : ""}tx, saving: `, tx);

			await this.txes.appendTx(hash, tx);

			this.__onUpdate();
			return;
		}

		// so we have no data, and it's not a known tx. just remember the state.
		// TODO: load savedState (previous tx_state_${hash}), in case this is just an upgrade. not really possible now, but to make it nice it should be done.
		tx = new Tx(data[7])
			.setHash(hash)
			.setTimestamp(data[6]);

		await AsyncStorage.setItem(`tx_state_${hash}`, JSON.stringify(tx));
		LogUtilities.toDebugScreen(`processTxState(hash: ${hash}) not known tx WITH NO DATA (OOPS...), state saved: `, tx);
		// no onupdate here as we did not save that Tx, umm, in the pool... yet.
	}

	/*
	async old_processTxState(hash, data) {
		LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) + `, data);

		let tx = await this.included_txes.getItem(hash);
		if (tx) { // known included tx, likely just updating state
			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known included+ tx: `, tx);
			if (data[0] !== null) // or maybe more ;-)
				tx.fromDataArray(data);
			else
				tx.upgradeState(data[7], data[6]);

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known included+ tx updated: `, tx);

			await this.included_txes.setItem(hash, tx.shallowClone());

			if (this.txfilter_checkMaxNonce(tx))
				await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());

			// to prevent the scenario when we sent the tx (it's in not_included_txes), but then we received "confirmed" (with no data) for it.
			// The tx is then in both included_txes and not_included_txes. once we get the data (i.e. nonce) we need to check if it's in not_included_txes and remove it.
			if (data[0] !== null && this.our_address.equals(tx.from_addr)) {
				// TODO: do we have to getItem() first? there would be no harm if we just removeItem() that doesn't exist, unless it throws exceptions - we'd have to ignore that exception.
				if (await this.not_included_txes.getItem(tx.getNonce()))
					await this.not_included_txes.removeItem(tx.getNonce());
			}

			this.__onUpdate();
			return;
		}

		// at this point it's a new tx we dont know or something that updates what we sent (found/stored by nonce)
		if (data[0] !== null && this.our_address.equals(Buffer.from(data[0], 'hex'))) { // TODO: check sender address, it has to be us, the not_included_txes only has OUR sent txes
			let nonce = typeof data[5] === 'string' ? parseInt(data[5]) : data[5];

			tx = await this.not_included_txes.getItem(nonce);
			if (!tx) { // not something we know yet, at all.
				tx = new Tx(data[7])
					.setHash(hash)
					.fromDataArray(data);

				LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) not known tx, saved: `, tx);

				await this.saveTx(tx);

				if (this.txfilter_checkMaxNonce(tx))
					await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());

				this.__onUpdate();

				return;
			}

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known NOT included tx: `, tx);

			tx.setHash(hash)
				.fromDataArray(data);

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known NOT included tx updated: `, tx);

			if (tx.state >= TxStates.STATE_INCLUDED) {
				LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) moving to persistent storage since state is now ${tx.state}`);
				await Promise.all([this.not_included_txes.removeItem(nonce), this.included_txes.setItem(tx.hash, tx.shallowClone())]);

				if (this.txfilter_checkMaxNonce(tx))
					await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());
			}
			else
				await this.not_included_txes.setItem(nonce, tx.shallowClone());

			this.__onUpdate();

			return;
		}
		else {
			// we have no nonce, only hash, and it's not in included. remember hash -> state and update it when promoting
			tx = new Tx(data[7])
				.setHash(hash)
				.setTimestamp(data[6]);

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) not known tx WITH NO DATA (OOPS...), saved: `, tx);
			await this.saveTx(tx);

			this.__onUpdate();
		}
	}
	*/

	async markNotIncludedTxAsErrorByNonce(nonce) {
		let tx = await this.not_included_txes.getItem(nonce);
		if (tx) {
			tx.setState(TxStates.STATE_ERROR);

			await this.not_included_txes.setItem(nonce, tx);

			this.__onUpdate();
		}
		else
			throw new NoSuchTxException(`unknown txnonce: ${nonce}`)
	}

	async getNextNonce() {
		LogUtilities.toDebugScreen(`getNextNonce(): next nonce: ${this.our_max_nonce + 1}`);
		return this.our_max_nonce + 1;
	}

	async clear(batch=false) {
		let tasks = [
			AsyncStorage.removeItem('_tx__temp'),
			AsyncStorage.setItem(maxNonceKey, '-1'),
			this.txes.wipe()
		];
		await Promise.all(tasks);

		// after this.txes.wipe() ends, we may wanna iterate all the keys and remove rogue tx_state_...

		this.our_max_nonce = -1;

		if (!batch)
			this.__onUpdate();

		return this;
	}

	async isDAIApprovedForCDAI() { // TODO: i dont think this should be here, really. this is not a storage function...
		throw new Error("not implemented yet");
		if (!this._isDAIApprovedForCDAI_cached) { // TODO: cache needs to be reset in onUpdate, unless it's true (it wont be more true after new transactions come)... although we may want to check the latest DAI approval only, what if we approve 0 after the MAX?
			const our_hex_address = this.our_address.toString('hex');
			const cdai_address = GlobalConfig.cDAIcontract.startsWith('0x') ? GlobalConfig.cDAIcontract.substr(2).toLowerCase() : GlobalConfig.cDAIcontract.toLowerCase();
			this._isDAIApprovedForCDAI_cached = (await this.included_txes.getAllTxes()).some(
				tx => tx.getTokenOperations('dai', TxTokenOpTypeToName.approval).some(
					x => (x.spender == cdai_address && x.approver == our_hex_address && x.amount === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
				)
			);
		}

		return this._isDAIApprovedForCDAI_cached;
	}
}








module.exports =  {
	Tx: Tx,
	// TxStorage: TxStorage, // nope, one instance to rule them all, let's not allow people to instantiate this.
	TxStates: TxStates,
	TxTokenOpTypeToName: TxTokenOpTypeToName,

	TxException: TxException,
	NoSuchTxException: NoSuchTxException,
	DuplicateNonceTxException: DuplicateNonceTxException,
	DuplicateHashTxException: DuplicateHashTxException,
	//InvalidStateTxException: InvalidStateTxException,

	storage: new TxStorage()
};
