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

class PersistTxStorageAbstraction {
	constructor(prefix='', onTxLoadCallback) {
		LogUtilities.toDebugScreen('PersistTxStorageAbstraction constructor called');
		this.storage = null;
		this.prefix = prefix; // `${this.prefix}${key}`

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

		this.last_write_promise = new Promise((res, rej) => {
			res();
		});
	}

	__tempbatchupds() {
		if (!this._tempwritetimer) {
			this.last_write_promise = new Promise((res, rej) => {
				this.last_write_resolve = res;
			});

			this._tempwritetimer  = setTimeout((() => {
				this._tempwritetimer = null;
				AsyncStorage.setItem(`${this.prefix}_temp`, JSON.stringify(this.storage));

				this.last_write_resolve();
			}).bind(this), 250);
		}
	}

	__tempstoragewritten() {
		return this.last_write_promise;
	}

	async getItem(key) {
		// return await AsyncStorage.getItem(`${this.prefix}${key}`);
		return this.storage[key];
	}

	async setItem(key, value) {
		// if (this.keyCache !== null)this.keyCache[key] = null;
		this.storage[key] = value;
		// return await AsyncStorage.setItem(`${this.prefix}${key}`, value);
		this.__tempbatchupds();
	}

	async removeItem(key) {
		// if (this.keyCache !== null) delete this.keyCache[key];
		delete this.storage[key];
		// return await AsyncStorage.removeItem(`${this.prefix}${key}`);
		this.__tempbatchupds();
	}

	async getAllKeys() {
		/*
		if (this.keyCache === null) {
			this.keyCache = {};
			this.storage.getAllKeys().forEach((x) => { if (x.startsWith(this.prefix)) this.keyCache[x] = null; });
		}
		*/
		// return await AsyncStorage.getAllKeys().filter(x => x.startsWith(prefix)).map(x => x.substr(prefix.length));
		return Object.keys(this.storage);
	}

	async getAllValues() {
		return Object.values(this.storage);
	}

	async getAllTxes() { // only returns TXes, not other stored values.
		return Object.values(this.storage).filter(x => x instanceof Tx);
	}

	async hasItem(key) {
		return this.storage.hasOwnProperty(key);
	}
}
class StorageAbstraction {
	constructor(prefix='', onFinishLoadingCallback) {
		LogUtilities.toDebugScreen('StorageAbstraction constructor called');
		this.storage = {};
		this.prefix = prefix; // `${this.prefix}${key}`
		this.keyCache = null;

		if (onFinishLoadingCallback)
			onFinishLoadingCallback();
	}

	async getItem(key) {
		// return await AsyncStorage.getItem(`${this.prefix}${key}`);
		return this.storage[key];
	}

	async setItem(key, value) {
		// if (this.keyCache !== null)this.keyCache[key] = null;
		this.storage[key] = value;
		// return await AsyncStorage.setItem(`${this.prefix}${key}`, value);
	}

	async removeItem(key) {
		// if (this.keyCache !== null) delete this.keyCache[key];
		delete this.storage[key];
	}

	async getAllKeys() {
		/*
		if (this.keyCache === null) {
			this.keyCache = {};
			this.storage.getAllKeys().forEach((x) => { if (x.startsWith(this.prefix)) this.keyCache[x] = null; });
		}
		*/
		return Object.keys(this.storage);
	}

	async getAllValues() {
		return Object.values(this.storage);
	}

	async hasItem(key) {
		return this.storage.hasOwnProperty(key);
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

	setSentTimestamp(tstamp) {
		this.sent_timestamp = tstamp;
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
				if (data.length > 9)
					this.setSentTimestamp(data[9]);
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

	getSortTimestamp() {
		return this.sent_timestamp ? this.sent_timestamp : this.timestamp;
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
		if (!this.sent_timestamp)
			return [this.getFrom(), this.getTo(), this.gas, this.gasPrice, this.value, this.nonce, this.timestamp, this.state, this.tokenData];

		return [this.getFrom(), this.getTo(), this.gas, this.gasPrice, this.value, this.nonce, this.timestamp, this.state, this.tokenData, this.sent_timestamp];
	}

	shallowClone() {
		/*let newtx = new Tx(this.state);
		Object.entries(this).forEach(([k, v]) => if (typeof v !== 'function') newtx[k] = v; );
		return newtx;*/
		return Object.assign(new Tx(), this);
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

		[0, 1, 2].forEach(() => {
			load_promises.push(new Promise((res, rej) => {
				promise_resolves.push(res);
				promise_rejects.push(rej);
			}));
		});

		this.onload_promise = Promise.all(load_promises);

		LogUtilities.toDebugScreen('TxStorage constructor called');
		this.included_max_nonce = -1; // for our txes
		// this.not_included_max_nonce = 0; // TODO

		AsyncStorage.getItem(maxNonceKey).then(x => {
				this.included_max_nonce = parseInt(x);
				promise_resolves[2]();
				LogUtilities.toDebugScreen(`MaxNonce: ${this.included_max_nonce}`);
		});

		this.included_txes = new PersistTxStorageAbstraction('_tx_', (x) => { if (x === undefined) promise_resolves[0](); }); // hash -> tx map
		this.not_included_txes = new StorageAbstraction('_ntx_', (x) => { if (x === undefined) promise_resolves[1](); }); // only for new things we send, it's a nonce -> tx map.

		if (ourAddress)
			this.our_address = hexToBuf(ourAddress);
		else
			this.our_address = null;

		this.on_update = [];

		AsyncStorage.getAllKeys().then(x => {
			LogUtilities.toDebugScreen(`AStor keys: ${x}`);
		});
	}

	isStorageReady() {
		return this.onload_promise;
	}

	__tempstoragewritten() {
		return this.included_txes.__tempstoragewritten();
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
		// try {
			this.on_update.push(func);
		// }
		// catch (e) {
		// 	LogUtilities.toDebugScreen(`addOnUpdate exception: ${e.message} @ ${e.stack}`);
		// 	let x = [];
		// 	for (i in func)
		// 		x.push(`${i}: ${func[i]}`);
		// 	LogUtilities.toDebugScreen(x.join('; '));
		// }
		return () => { this.unsubscribe(func); };
	}
	unsubscribe(func) {
		this.on_update = this.on_update.filter((x) => x !== func);
		return this;
	}


	setOwnAddress(ourAddress) {
		this.our_address = hexToBuf(ourAddress);
	}

	getOwnAddress() {
		return this.our_address.toString('hex');
	}

	async newTx(state=TxStates.STATE_NEW, nonce) {
		const now = Math.trunc(Date.now() / 1000);
		let tx = new Tx(state)
			.setTimestamp(now)
			.setSentTimestamp(now)
			.setNonce(nonce ? nonce : await this.getNextNonce());

		tx.from_addr = this.our_address;

		return tx;
	}

	__onUpdate() {
		const startTime = Date.now();
		LogUtilities.toDebugScreen('TxStorage __onUpdate() called');
		// TODO: promise.all also not_included
		this.tempGetAllAsList().then((t) => {
			// try {
			// 	t.sort((a, b) => b.getTimestamp() - a.getTimestamp());
			// }
			// catch (e) {
			// 	LogUtilities.toDebugScreen(`TxStorage __onUpdate() sort() exc: ${e.message} @ ${e.stack}\nt:${t}`);
			// 	throw e;
			// }
			try {
				// LogUtilities.toDebugScreen(`TxStorage __executeUpdateCallbacks() called, t: ${t.length}`);
				this.on_update.forEach(x => x(t));
				// LogUtilities.toDebugScreen('TxStorage __executeUpdateCallbacks() finishing');
			}
			catch (e) {
				LogUtilities.toDebugScreen(`__executeUpdateCallbacks exception: ${e.message} @ ${e.stack}`);
			}
		}).catch((e) => {
			LogUtilities.toDebugScreen(`TxStorage __onUpdate() getAllTxes() exc: ${e.message} @ ${e.stack}`);
		});
		LogUtilities.toDebugScreen(`${Date.now() - startTime}ms: TxStorage __onUpdate() finishing`);
		return this;
	}

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

	/*
	async upgradeTxStateByHash(hash, new_state, new_timestamp) {
		let tx = await this.included_txes.getItem(hash);
		if (tx) {
			tx.upgradeState(new_state, new_timestamp);
			await this.included_txes.setItem(hash, tx);
			this.__onUpdate();
		}
		else
			throw new NoSuchTxException(`unknown txhash: ${hash}`)
	}

	async upgradeTxStateByNonce(nonce, new_state, new_timestamp, hash) {
		let tx = await this.not_included_txes.getItem(nonce);
		if (tx) {
			tx.upgradeState(new_state, new_timestamp);
			if (hash) {
				if (this.included_txes.hasItem(hash))
					throw new DuplicateHashTxException(`hash ${hash} already known`);

				tx.setHash(hash);
				await Promise.all([this.not_included_txes.removeItem(nonce), this.included_txes.setItem(tx.hash, tx)]);

				if (tx.nonce > this.included_max_nonce)
					this.included_max_nonce = tx.nonce;
			}

			this.__onUpdate();
		}
		else
			throw new NoSuchTxException(`unknown txnonce: ${nonce}`)
	}
	*/

	async getTxes(id, filterid) {
		throw new Error('not implemented yet');
	}


	txfilter_checkMaxNonce(tx) { // not a real filter, but updates our max nonce.
		if (tx.from_addr && tx.nonce > this.included_max_nonce && this.our_address.equals(tx.from_addr)) {
			this.included_max_nonce = tx.nonce;
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

	async parseTxHistory(histObj) {
		// LogUtilities.toDebugScreen('TxStorage parseTxHistory() called');
		await Promise.all(
			Object.entries(histObj).map(([txhash, data]) => {
				if (txhash == "_contracts")
					return;

				let tx = new Tx(data[7])
					.setHash(txhash)
					.fromDataArray(data);

				return this.saveTx(tx, true);
			})
		);

		await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());

		LogUtilities.toDebugScreen(`TxStorage parseTxHistory() end, entries: ${(await this.included_txes.getAllTxes()).length}`);
		this.__onUpdate();
	}

	async processTxState(hash, data) {
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

				LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) not known OUR tx, saved: `, tx);

				await this.saveTx(tx);

				if (this.txfilter_checkMaxNonce(tx))
					await AsyncStorage.setItem(maxNonceKey, this.included_max_nonce.toString());

				this.__onUpdate();

				return;
			}

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known OUR NOT included tx: `, tx);

			tx.setHash(hash)
				.fromDataArray(data);

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) known OUR NOT included tx updated: `, tx);

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
		else if (data[0] !== null) { // not our, but we got the data. just save it.
			tx = new Tx(data[7])
				.setHash(hash)
				.fromDataArray(data);

			LogUtilities.toDebugScreen(`parseTxState(hash: ${hash}) not known tx, saved: `, tx);

			await this.saveTx(tx);

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

	async markSentTxAsErrorByNonce(nonce) {
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
		let max = 0;
		const incmax = await this.getIncludedNextNonce();

		(await this.not_included_txes.getAllKeys()).forEach(x => { const intx = parseInt(x); if (intx >= max) max = intx + 1; });

		LogUtilities.toDebugScreen(`next nonce: max:${max} incmax:${incmax} not included keys:${(await this.not_included_txes.getAllKeys()).join("  ||  ")}`);
		return incmax > max ? incmax : max;
	}

	async getIncludedNextNonce() {
		return this.included_max_nonce + 1;
	}

	async clear(batch=false) {
		let [t1, t2] = await Promise.all([this.included_txes.getAllKeys(), this.not_included_txes.getAllKeys()]);

		let tasks = t1.map((x) => this.included_txes.removeItem(x));
		t2.forEach(x => tasks.push(this.not_included_txes.removeItem(x)));
		tasks.push(AsyncStorage.setItem(maxNonceKey, '-1'));
		await Promise.all(tasks);

		this.included_max_nonce = -1;

		if (!batch)
			this.__onUpdate();

		return this;
	}

	async tempGetAllAsList() {
		LogUtilities.toDebugScreen('TxStorage tempGetAllAsList() called');
		if (!this.included_txes || !this.not_included_txes) {
			LogUtilities.toDebugScreen('tempGetAllAsList() called and our properties are undef.');
			LogUtilities.dumpObject('this', this);
			LogUtilities.logError('tempGetAllAsList() called and our properties are undef.');
			return;
		}

		let ret = await this.included_txes.getAllTxes();
		if (!ret) {
			LogUtilities.toDebugScreen('tempGetAllAsList() await this.included_txes.getAllTxes() returned:');
			LogUtilities.dumpObject('ret', ret);
			LogUtilities.dumpObject('this.included_txes', this.included_txes);
			LogUtilities.logError('tempGetAllAsList() await this.included_txes.getAllTxes() returned null?');
			return;
		}

		const nit = (await this.not_included_txes.getAllValues());
		LogUtilities.toDebugScreen(`tempGetAllAsList() not included txes: `, nit);
		nit.forEach((x) => ret.push(x));

		ret.sort((a, b) => b.getSortTimestamp() - a.getSortTimestamp());

		return ret;
	}

	async isDAIApprovedForCDAI() { // TODO: i dont think this should be here, really. this is not a storage function...
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
