'use strict';

import LogUtilities from '../utilities/LogUtilities';
import AsyncStorage from '@react-native-community/async-storage';

const crypto = require('crypto');

const GlobalConfig = require('../config.json');

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
	tok2eth: 'tok2eth',
	depositPool: 'depositPool',
	withdraw: 'withdraw'
};


// ========== helper functions ==========
function dropHexPrefix(hex) {
	return typeof hex === 'string' ? (hex.startsWith('0x') ? hex.substr(2) : hex) : hex;
}
function hexToBuf(hex) {
	return typeof hex === 'string' ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex') : null;
}

// ========== locks ==========
class asyncLocks {
	constructor() {
		this.locks = {};
	}

	async lock(name) {
		let l = this.locks[name];
		while (l && l.promise) // we wait as long as there is a promise to be awaited
			await l.promise; // the other "thread" will resolve and clear that promise.

		if (!l)
			l = this.locks[name] = {};

		// no promise, we're ready to go. create a new promise and insert it into locks, so that other threads can wait for it.
		l.promise = new Promise((resolve, reject) => {
			l.resolve = resolve;
			l.reject = reject;
		});
	}

	unlock(name) {
		let l = this.locks[name];
		if (!l || !l.promise)
			throw new Error(`unlock() called on a non-locked lock ${name}`);

		l.resolve();
		delete(l.promise);
		delete(l.resolve);
		delete(l.reject);
	}
}

// ========== storage abstraction ==========
/*
	prefix is a storage-wide prefix.
	hash is transaction hash

	${prefix}_${hash} for txdata (hash can be nonce_${number})
	${prefix}iall${num} for buckets (counts from 0)
	${prefix}iallc for item count
	${prefix}i${indexname}${num} for buckets again
	${prefix}i${indexname}c for count in given index

	`all' is just an index name for all items.
	hashes in buckets are always sorted by timestamp
*/

const storage_bucket_size = Math.floor(4096 / (64+1));
class PersistTxStorageAbstraction {
	constructor(prefix='') {
		LogUtilities.toDebugScreen('PersistTxStorageAbstraction constructor called');

		this.cache = {};
		this.counts = {};
		this.filters = {};
		this.toplocked_per_filter = {};
		this.locks = {};

		this.prefix = prefix; // `${this.prefix}${key}`

		this.debug = true;

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

	__init_lock(index) { // locks are noop for now, locking happens in TxStorage.
		return;
	}

	async __lock(index) {
		return;
	}

	__unlock(index) {
		return;
	}

	init_storage(name_to_filter_map, init_finish_callback) {
		let load_count = 0;

		const checkFinish = () => {
			load_count--;

			if (load_count == 0) {
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction init_storage(): tasks executed. counts:${JSON.stringify(this.counts)} toplocked:${JSON.stringify(this.toplocked_per_filter)}`);

				if (this.debug) {
					let temp_debug_bucket_names = [];
					Object.keys(this.counts).forEach(x => {
						for (let i = 0; i < Math.ceil(this.counts[x] / storage_bucket_size) + 1; ++i)
							temp_debug_bucket_names.push(`${this.prefix}i${x}${i}`);
					});
					function bstats(buck) {
						if (typeof buck !== 'string')
							return JSON.stringify(buck);

						let itemlens = {};
						let cnt = 0;
						buck.split(',').forEach(x => { itemlens[x.length] = (itemlens[x.length] ? itemlens[x.length] + 1 : 1); ++cnt; });

						return `cnt:${cnt} lengths:${JSON.stringify(itemlens)}`;
					}

					AsyncStorage.multiGet(temp_debug_bucket_names).then(x => {
						x.sort((a, b) => a[0].localeCompare(b[0]));
						x.forEach(([n, v]) => LogUtilities.toDebugScreen(`${n} --> ${bstats(v)}`));
					});
				}

				if (init_finish_callback)
					init_finish_callback();
			}
		};

		const countToplocked = (name, bucketnum) => {
			this.__getKey(`${this.prefix}i${name}${bucketnum}`, this.__decodeBucket).then(x => {
				for (let i = x.length - 1; i >= 0; --i) {
					if (x[i].startsWith(txNoncePrefix))
						this.toplocked_per_filter[name]++;

					else {
						checkFinish();
						return;
					}
				}
				if (bucketnum == 0) {
					checkFinish();
					return;
				}

				countToplocked(name, bucketnum - 1);
			});
		}

		const load_index_data = (function(name) {
			load_count++;

			this.__init_lock(name);
			this.toplocked_per_filter[name] = 0;

			AsyncStorage.getItem(`${this.prefix}i${name}c`).then(x => {
				this.counts[name] = x ? parseInt(x) : 0;
				if (this.counts[name] > 0) {
					const lastBucketNum = Math.floor((this.counts[name] - 1) / storage_bucket_size);
					countToplocked(name, lastBucketNum);
				}
				else
					checkFinish();
			});
		}).bind(this);

		load_index_data('all');

		Object.entries(name_to_filter_map).forEach(([name, filter]) => {
			this.filters[name] = filter;

			load_index_data(name);
		});
	}

	async __getKey(k, processfunc) {
		// TODO: needs cache cleaning
		if (!this.cache[k]) {
			const val = await AsyncStorage.getItem(k);
			if (this.debug && (val === null || val === undefined))
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __getKey(${k}) warning - returned null!`);

			this.cache[k] = processfunc ? processfunc(val) : val;
		}

		return this.cache[k];
	}

	async __setKey(k, v, processfunc) {
		this.cache[k] = v;

		await AsyncStorage.setItem(k, processfunc ? processfunc(v) : v);
	}

	async __removeKey(k) { // there's a bit of a race condition. if we removeKey and at the same time getKey, remove will clear it from cache, but not from storage yet. getKey will potentially fetch it from storage then, before removeKey removes it from there.
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

		if (this.debug) {
			if (!this.counts[index])
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction getTxByNum() requested data from index that has no count defined:${index}`);
			else
				if (num >= this.counts[index])
					LogUtilities.toDebugScreen(`PersistTxStorageAbstraction getTxByNum() requested data index:${index} num:${num}, but count is ${this.counts[index]}`);
		}

		const bucket = await this.__getKey(`${this.prefix}i${index}${bucket_num}`, this.__decodeBucket);
		return await this.getTxByHash(bucket[bucket_pos]);
	}

	async getTxByHash(hash) {
		return await this.__getKey(`${this.prefix}_${hash}`, (data) => { if (!data) return null; data = JSON.parse(data); return new Tx(data[7]).setHash(hash).fromDataArray(data, false); });
	}

	async getLastTx(index='all') {
		if (this.counts[index] == 0)
			return null;

		const bucket_num = Math.floor((this.counts[index] - 1) / storage_bucket_size);
		const bucket = await this.__getKey(`${this.prefix}i${index}${bucket_num}`, this.__decodeBucket);

		return await this.getTxByHash(bucket[bucket.length - 1]);
	}


	// async getHashesAt(idarray, index='all') {
	// 	const ret = [];
	//
	// 	let last_bucket = null;
	// 	let last_bucket_num = null;
	//
	// 	for (let i = 0; i < idarray.length; ++i) {
	// 		const num = idarray[i];
	// 		const bucket_num = Math.floor(num / storage_bucket_size);
	// 		const bucket_pos = num % storage_bucket_size;
	//
	// 		if (bucket_num === last_bucket_num)
	// 			ret.push(last_bucket[bucket_pos]);
	// 		else {
	// 			last_bucket = await this.__getKey(`${this.prefix}i${index}${bucket_num}`, this.__decodeBucket);
	// 			last_bucket_num = bucket_num;
	// 			ret.push(last_bucket[bucket_pos]);
	// 		}
	// 	}
	//
	// 	return ret;
	// }

	/*
	async getHashRanges(index='all', start, end) {
		const high_bucket = Math.floor(end / storage_bucket_size);
		const high_bucket_off = end % storage_bucket_size;
		const low_bucket = Math.floor(start / storage_bucket_size);
		const low_bucket_off = start % storage_bucket_size;

		const bucketnames = [];
		for (let i = low_bucket; i <= high_bucket; ++i)
			bucketnames.push(`${this.prefix}i${index}${i}`);

		await this.__lock(index);

		const bucketdata = await AsyncStorage.multiGet(bucketnames); // looks like the results returned are in the same order we're requesting them https://github.com/react-native-community/async-storage/blob/master/lib/AsyncStorage.js#L266
		LogUtilities.toDebugScreen(`getHashRanges(): bucketnames.length = ${bucketnames.length}, bucketdata.length == ${bucketdata.length}`);

		const ret = [];
		for (let i = 0; i < bucketnames.length; ++i) {
			let add_items;
			const bd = this.__decodeBucket(bucketdata[i][1]);

			//LogUtilities.toDebugScreen(`getHashRanges(): bucketdata[${i}] = ${bd}`);

			if (i == 0) {
				if (i == bucketnames.length - 1)
					add_items = bd.slice(low_bucket_off, high_bucket_off);
				else
					add_items = bd.slice(low_bucket_off);
			}
			else if (i == bucketnames.length - 1) {
				add_items = bd.slice(0, high_bucket_off);
			}
			else
				add_items = bd;

			ret.splice(ret.length, 0, ...add_items);
		}

		// LogUtilities.toDebugScreen(`getHashRanges(): ret == ${ret}}`);

		const txdata = await AsyncStorage.multiGet(ret.map(x => `${this.prefix}_${x}`));

		LogUtilities.toDebugScreen(`getHashRanges(): txdata.length == ${txdata.length}, ret.length == ${ret.length}`);
		for (let i = 0; i < ret.length; ++i) {
			try {
				const tx = JSON.parse(txdata[i][1]);
				ret[i] = [ret[i], tx[7]];
			}
			catch (e) {
				LogUtilities.toDebugScreen(`getHashRanges(): txdata[${i}] == `, txdata[i]);
				ret[i] = [ret[i], null]; // or should we let it blow up? hmm
			}
		}

		await this.__unlock(index);

		return ret;
	}
	*/

	async getHashes(index='all', offset=0) {
		await this.__lock(index);

		const high_bucket = Math.floor((this.counts[index] - 1) / storage_bucket_size);
		const low_bucket = Math.floor(offset / storage_bucket_size);
		const low_bucket_off = offset % storage_bucket_size;

		const bucketnames = [];
		for (let i = low_bucket; i <= high_bucket; ++i)
			bucketnames.push(`${this.prefix}i${index}${i}`);

		const bucketdata = await AsyncStorage.multiGet(bucketnames); // looks like the results returned are in the same order we're requesting them https://github.com/react-native-community/async-storage/blob/master/lib/AsyncStorage.js#L266
		LogUtilities.toDebugScreen(`getHashes(): bucketnames.length = ${bucketnames.length}, bucketdata.length == ${bucketdata.length}`);

		const ret = [];
		for (let i = 0; i < bucketnames.length; ++i) {
			let add_items;
			const bd = this.__decodeBucket(bucketdata[i][1]);

			//LogUtilities.toDebugScreen(`getHashRanges(): bucketdata[${i}] = ${bd}`);

			if (i == 0)
				add_items = bd.slice(low_bucket_off);

			else
				add_items = bd;

			ret.splice(ret.length, 0, ...add_items);
		}

		// LogUtilities.toDebugScreen(`getHashes(): ret == ${ret}}`);

		const txdata = await AsyncStorage.multiGet(ret.map(x => `${this.prefix}_${x}`));

		LogUtilities.toDebugScreen(`getHashes(): txdata.length == ${txdata.length}, ret.length == ${ret.length}`);
		for (let i = 0; i < ret.length; ++i) {
			try {
				const tx = JSON.parse(txdata[i][1]);
				ret[i] = [ret[i], tx[7]];
			}
			catch (e) {
				LogUtilities.toDebugScreen(`getHashes(): txdata[${i}] == `, txdata[i]);
				ret[i] = [ret[i], null]; // or should we let it blow up? hmm
			}
		}

		this.__unlock(index);

		return ret;
	}

	/*
	async getHashes(index='all', offset=0) {
		// TODO: rename this to get checksums or something, and hash things inside here from first bucket (or from offset if specified!),
		// returning only the checksums at given checkpoints. sigh. otherwise we're keeping too much data in memory.

		const bucket_count = Math.floor((this.counts[index] - 1) / storage_bucket_size);
		const low_bucket = Math.floor(offset / storage_bucket_size);
		const low_bucket_off = offset % storage_bucket_size;

		const bucketnames = [];
		for (let i = low_bucket; i <= bucket_count; ++i)
			bucketnames.push(`${this.prefix}i${index}${i}`);

		const hashes_in_order = [];

		const buckets = {};
		(await AsyncStorage.multiGet(bucketnames)).forEach(([k, v]) => buckets[k] = v);
		bucketnames.forEach((n, idx) => {
			const itms = (idx == 0 ? this.__decodeBucket(buckets[n]).slice(low_bucket_off) : this.__decodeBucket(buckets[n]));
			// hashes_in_order.splice(hashes_in_order.length, 0, ...itms);

			itms.forEach(x => hashes_in_order.push([x, null]));

		});

		const txstates = {};

		(await AsyncStorage.multiGet(hashes_in_order.map(x => `${this.prefix}_${x[0]}`))).forEach(([k, v]) => {
			try {
				txstates[k] = JSON.parse(v)[7];
			}
			catch (e) {
				LogUtilities.toDebugScreen(`getHashes(): ${k} returned ${v}`);
			}
		});

		hashes_in_order.forEach(x => {
			const prefixkey = `${this.prefix}_${x[0]}`;
			x[1] = txstates[prefixkey];
		});

		return hashes_in_order;
	}
	*/

	async appendTx(hash, tx, toplock=false) {
		// run filters to see which indices this goes in. for each index, append to the last bucket (make sure we create a new one if it spills)
		let append_indices = ['all'];
		Object.entries(this.filters).forEach(([index, filterfunc]) => {
			if (filterfunc(tx))
				append_indices.push(index);
		});

		if (this.debug)
			LogUtilities.toDebugScreen(`appendTx(${hash}): matches indices:${append_indices.map(x => `${x}: ${this.counts[x]}`).join()}; tx:${JSON.stringify(tx)})`)

		let tasks = [this.__setKey(`${this.prefix}_${hash}`, tx, JSON.stringify)];

		append_indices.forEach(x => {
			tasks.push((async (index) => {
				let localtasks = [];

				await this.__lock(index);
				const last_bucket_num = Math.floor(this.counts[index] / storage_bucket_size);

				if (toplock) { // easy, just insert at the top as last element
					const bucket_key = `${this.prefix}i${index}${last_bucket_num}`;
					if (this.counts[index] % storage_bucket_size == 0) { // new bucket
						if (this.debug)
							LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(top): index:${index} item_num:${this.counts[index]} new bucket, last_bucket_num:${last_bucket_num}`);

						localtasks.push(this.__setKey(bucket_key, [hash], this.__encodeBucket));
					}
					else { // add to bucket
						if (this.debug)
							LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(top): index:${index} item_num:${this.counts[index]} last_bucket_num:${last_bucket_num}`);

						localtasks.push(this.__getKey(bucket_key, this.__decodeBucket).then(async x => { x.push(hash); await this.__setKey(bucket_key, x, this.__encodeBucket); }));
					}
				}
				else { // inserting in the middle, so we may need to carry to later buckets
					const global_position = this.counts[index] - this.toplocked_per_filter[index];
					const bucket_num = Math.floor(global_position / storage_bucket_size);
					const bucket_pos = global_position % storage_bucket_size;

					if (this.debug)
						LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(): index:${index} item_num:${global_position} bucket_num:${bucket_num} last_bucket_num:${last_bucket_num} toplocked:${this.toplocked_per_filter[index]}`);

					localtasks.push((async () => { // sadly we have to do it one by one, because to carry last velue of bucket x to x+1 we need to know it... therefore fetch, insert, pop(), then we can move onto next bucket
						let carry = null; // this gets moved to another bucket, if necessary

						for (let i = bucket_num; i <= last_bucket_num; ++i) {
							const bucket_key = `${this.prefix}i${index}${i}`;
							const x = await this.__getKey(bucket_key, this.__decodeBucket);

							if (this.debug)
								LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(): index:${index} bucket:${i} len:${x.length} carry:${carry !== null}${i == bucket_num ? ` splice_position:${bucket_pos}` : ''}`);

							if (carry !== null) { // add what we carried from previous, if anything
								x.unshift(carry);
								carry = null;
							}

							if (i == bucket_num) { // this is the bucket we're inserting our initial value
								x.splice(bucket_pos, 0, hash);
							}

							if (x.length > storage_bucket_size) { // need to carry
								carry = x.pop();
							}

							await this.__setKey(bucket_key, x, this.__encodeBucket);
						}

						if (carry !== null) { // looks like the last bucket overflowed, so we need to create another bucket too.
							if (this.debug)
								LogUtilities.toDebugScreen(`PersistTxStorageAbstraction appendTx(): index:${index} new bucket:${last_bucket_num + 1} carry:${carry !== null}`);

							const bucket_key = `${this.prefix}i${index}${last_bucket_num + 1}`;
							await this.__setKey(bucket_key, [hash], this.__encodeBucket);
						}
					})());
				}

				const new_count = this.counts[index] + 1;
				localtasks.push(this.__setKey(`${this.prefix}i${index}c`, new_count.toString()));

				await Promise.all(localtasks);
				this.counts[index] = new_count;

				if (toplock)
					this.toplocked_per_filter[index]++;

				this.__unlock(index);
			})(x));
		});

		await Promise.all(tasks);

	}

	async bulkLoad(txarray) { // TODO: add locking
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
		this.counts = index_counts;
		this.cache = {};

		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction bulkLoad(): tasks executed. load time:${Date.now() - startTime}ms`);
	}

	async wipe() { // TODO: add locking
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

	async __replaceKeyInIndex(oldkey, newkey, index='all', toplockremove=false) {
		await this.__lock(index);

		// the way to proceed with toplockremove == true
		// we need to find the item first, the way we do it now is fine.
		// once we have iten_pos, let's check if it's in toplocked, i.e. it's global_pos > this.counts[index] - this.toplocked_per_filter[index] (TODO: smells like off by one possible, maybe >= not >?)
		// if it's not toplocked, then we could issue a warning (or even throw new Error(), it shouldnt happen), that said, if that happens we can just replace the key and be done with it.
		// if until now everything is fine,
		// we have position of the item we need to move, we have the position we need to move it to (basically this.counts[index] - this.toplocked_per_filter[index])
		// we splice our item out; at this point current bucket has 1 fewer items.
		// so now until we reach destination bucket, we need to pop() from previous bucket and unshift() to current (carry)
		// when we reach the destination bucket, we just splice the item in in its intended position (since at this point we have carried last item to the bucket+1, we have room for it here)

		const last_bucket = Math.floor((this.counts[index] - 1) / storage_bucket_size);

		if (!toplockremove) {
			let bucket_count = last_bucket;

			if (this.debug)
				LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): last bucket id: ${last_bucket}`);

			while (bucket_count >= 0) {
				let bucket = await this.__getKey(`${this.prefix}i${index}${bucket_count}`, this.__decodeBucket);
				let pos = bucket.indexOf(oldkey);
				if (pos >= 0) {
					if (this.debug)
						LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(): found item at position ${pos} in bucket ${bucket_count}`);

					bucket[pos] = newkey;
					await this.__setKey(`${this.prefix}i${index}${bucket_count}`, bucket, this.__encodeBucket);

					this.__unlock(index);
					return;
				}

				bucket_count--;
			}
		}
		else {
			// here comes the fun!
			const destination_pos = this.counts[index] - this.toplocked_per_filter[index];
			const destination_bucket = Math.floor(destination_pos / storage_bucket_size);
			const destination_bucket_pos = destination_pos % storage_bucket_size;

			// first, find the item.
			let item_bucket_pos;
			let item_bucket_num;
			let bucket;

			for (item_bucket_num = last_bucket; item_bucket_num >= 0; --item_bucket_num) {
				bucket = await this.__getKey(`${this.prefix}i${index}${item_bucket_num}`, this.__decodeBucket);
				item_bucket_pos = bucket.indexOf(oldkey);
				if (item_bucket_pos >= 0)
					break;
			}

			if (item_bucket_pos >= 0) { // we found it!
				if (this.debug)
					LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${index}): found item at position ${item_bucket_pos} in bucket ${item_bucket_num}, moving to ${destination_bucket_pos}@${destination_bucket}, toplocked:${this.toplocked_per_filter[index]}`);

				if (item_bucket_num < destination_bucket || (item_bucket_num == destination_bucket && item_bucket_pos < destination_bucket_pos)) {
					this.__unlock(index);
					LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): item was already not in toplocks`);
					throw new Error(`key "${oldkey}" not found in the index "${index}"`);
				}

				let bgtasks = [];

				bucket.splice(item_bucket_pos, 1); // remove from current bucket. if it was a full bucket, it's now lacking one item

				for (let i = item_bucket_num; i > destination_bucket; --i) { // we fetch early buckets until we reach destination, to shift items one right
					if (this.debug)
						LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${index}): last item of bucket ${i - 1} -> first item of bucket ${i}`);

					const prev_bucket = await this.__getKey(`${this.prefix}i${index}${i - 1}`, this.__decodeBucket);

					bucket.unshift(prev_bucket.pop()); // move last item of prev bucket as first of current
					bgtasks.push(this.__setKey(`${this.prefix}i${index}${i}`, bucket, this.__encodeBucket)); // save current bucket, no need to touch previous yet

					bucket = prev_bucket;
				}

				if (this.debug)
					LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${index}): inserting ${newkey} at ${destination_bucket_pos} in bucket ${destination_bucket}. end.`);

				bucket.splice(destination_bucket_pos, 0, newkey);
				bgtasks.push(this.__setKey(`${this.prefix}i${index}${destination_bucket}`, bucket, this.__encodeBucket));

				await Promise.all(bgtasks); // now write it all.

				this.toplocked_per_filter[index]--;

				this.__unlock(index);
				return;
			}
		}

		this.__unlock(index);
		LogUtilities.toDebugScreen(`PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): item not found...`);
		throw new Error(`key "${oldkey}" not found in the index "${index}"`);
	}

	async removeKey(oldkey, index='all') {
		// TODO: this'll have to rewrite all the buckets...
		throw new Error("not implemented yet");
		await this.__lock(index);
		let bucket_count = Math.ceil(this.counts[index] / storage_bucket_size) - 1; // not exactly count, more like index and those go from 0

		while (bucket_count >= 0) {
			let bucket = await this.__getKey(`${this.prefix}i${index}${bucket_count}`);
			let pos = bucket.indexOf(oldkey);
			if (pos >= 0) {
				// TODO.

				this.__unlock(index);
				return;
			}

			bucket_count--;
		}

		this.__unlock(index);
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

	async replaceTx(oldtx, newtx, oldhash, newhash, toplockremove=false) {
		// for now this can only be called when changing nonce_xxx to proper txhash, so when 'sent' state goes into included. soon added: nonce_xxx to fail_xxx when a tx errors out (and we dont want to keep the nonce_xxx key as it'll get overwritten)

		// let indexDiff = this.__indexDiff(oldtx, newtx);
		// TODO: index differences disregarded for now.

		if (this.debug) {
			LogUtilities.toDebugScreen(`PersistTxStorageAbstraction replaceTx(): replace oldtx ${oldhash} -> newtx ${newhash}`);
			LogUtilities.toDebugScreen(`PersistTxStorageAbstraction replaceTx(): oldtx:${JSON.stringify(oldtx)}`)
			LogUtilities.toDebugScreen(`PersistTxStorageAbstraction replaceTx(): newtx:${JSON.stringify(newtx)}`)
		}

		await this.__setKey(`${this.prefix}_${newhash}`, newtx, JSON.stringify);
		await this.__removeKey(`${this.prefix}_${oldhash}`);

		await Promise.all([this.__replaceKeyInIndex(oldhash, newhash, 'all', toplockremove)].concat(Object.entries(this.filters).map(([index, filterfunc]) => {
			if (filterfunc(newtx))
				return this.__replaceKeyInIndex(oldhash, newhash, index, toplockremove);
		})));

		// throw new Error("not implemented yet");
	}

	async updateTx(oldtx, newtx, hash) {
		// no hash change, therefore sent stays sent (nonce_xxx) or included stays included (txhash)

		// let indexDiff = this.__indexDiff(oldtx, newtx);
		// TODO: index differences disregarded for now.

		if (this.debug)
			LogUtilities.toDebugScreen(`PersistTxStorageAbstraction updateTx(): replace (${hash}) oldtx:${JSON.stringify(oldtx)} with newtx:${JSON.stringify(newtx)}`);

		await this.__setKey(`${this.prefix}_${hash}`, newtx, JSON.stringify);

		//throw new Error("not implemented yet");
	}


	async debugDumpAllTxes(index='all') {
		// const loadTx = (data) => { if (!data) return null; data = JSON.parse(data); return new Tx(data[7]).setHash(hash).fromDataArray(data, false); }

		const bucket_count = Math.floor((this.counts[index] - 1) / storage_bucket_size);
		const bucketnames = [];
		for (let i = 0; i <= bucket_count; ++i)
			bucketnames.push(`${this.prefix}i${index}${i}`);

		const hashes_in_order = [];

		const buckets = {};
		(await AsyncStorage.multiGet(bucketnames)).forEach(([k, v]) => buckets[k] = v);
		bucketnames.forEach((n) => {
			this.__decodeBucket(buckets[n]).forEach((hash) => hashes_in_order.push(`${this.prefix}_${hash}`));
		});
		// delete(buckets);

		const txes = [];
		(await AsyncStorage.multiGet(hashes_in_order)).forEach(([k, v]) => txes[k] = v);

		hashes_in_order.forEach((n) => {
			LogUtilities.toDebugScreen(n, txes[n]);
		});

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

class TxTokenDepositPoolOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.depositor, this.depositPoolAmount] = arr;
		// this.depositor = arr[0]; this.depositPoolAmount = arr[1];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.depositPool]: [this.depositor, this.depositPoolAmount] };
	}
}

class TxTokenWithdrawOp extends TxTokenOp {
	constructor (arr) {
		super();
		[this.withdrawer, this.withdrawAmount] = arr;
		// this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
	}

	toJSON() {
		return { [TxTokenOpTypeToName.withdraw]: [this.withdrawer, this.withdrawAmount] };
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
	[TxTokenOpTypeToName.tok2eth]: TxTokenTok2EthOp,
	[TxTokenOpTypeToName.depositPool]: TxTokenDepositPoolOp,
	[TxTokenOpTypeToName.withdraw]: TxTokenWithdrawOp
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
const txNoncePrefix = 'nonce_';
const txFailPrefix = 'fail_';
const txStatePrefix = 'state_';

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
			'dai': this.txfilter_isRelevantToDai, // doesn't use this, no need for .bind(this)
			'odcda': this.txfilter_ourDAIForCDAIApprovals.bind(this),
		}, (x) => { if (x === undefined) promise_resolves[0](); })

		if (ourAddress)
			this.our_address = hexToBuf(ourAddress);
		else
			this.our_address = null;

		this.on_update = [];

		// AsyncStorage.getAllKeys().then(x => {
		// 	LogUtilities.toDebugScreen(`AStor keys: ${x}`);
		// });

		// this has sensitive data, so let's not:
		// AsyncStorage.getItem('persist:root').then(x => {
		//  	LogUtilities.toDebugScreen(`persist:root: ${x}`);
		// });


		this.locks = new asyncLocks();
	}

	async __lock(name) {
		LogUtilities.toDebugScreen(`TxStorage attempt __lock(${name})`);
		const t = Date.now();
		await this.locks.lock(name);
		LogUtilities.toDebugScreen(`TxStorage __lock(${name}) succeeded, wait time:${Date.now() - t}ms`);
	}

	__unlock(name) {
		this.locks.unlock(name);
		LogUtilities.toDebugScreen(`TxStorage __unlock(${name})`);
	}


	isStorageReady() {
		return this.onload_promise;
	}

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
		if (this.our_address)
			return this.our_address.toString('hex');

		return null;
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

		if (tx.hasTokenOperations('uniswap'))
			return tx.hasTokenOperation('uniswap', TxTokenOpTypeToName.eth2tok) ||
				tx.hasTokenOperation('uniswap', TxTokenOpTypeToName.tok2eth);

		if (tx.hasTokenOperations('poolTogether'))
			return tx.hasTokenOperation('poolTogether', TxTokenOpTypeToName.depositPool) ||
				tx.hasTokenOperation('poolTogether', TxTokenOpTypeToName.withdraw)

		return false;
	}

	txfilter_ourDAIForCDAIApprovals(tx) {
		const our_hex_address = this.our_address.toString('hex');
		const cdai_address = GlobalConfig.cDAIcontract.startsWith('0x') ? GlobalConfig.cDAIcontract.substr(2).toLowerCase() : GlobalConfig.cDAIcontract.toLowerCase();
		return tx.getTokenOperations('dai', TxTokenOpTypeToName.approval).some(
			x => (x.spender == cdai_address && x.approver == our_hex_address)
		);
	}

	async saveTx(tx) { // used now only to save our own sent txes, therefore those wont have anything but the nonce.
		await this.__lock('txes');
		const nonceKey = `${txNoncePrefix}${tx.getNonce()}`;
		await this.txes.appendTx(nonceKey, tx, true);
		LogUtilities.toDebugScreen(`saveTx(): tx saved (key:${nonceKey}): `, tx);
		if (this.txfilter_checkMaxNonce(tx)) {
			await AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
			LogUtilities.toDebugScreen(`saveTx(): our_max_nonce changed to ${this.our_max_nonce}`);
		}

		this.__unlock('txes');
		this.__onUpdate();
	}

	async parseTxHistory(histObj) {
		LogUtilities.toDebugScreen('TxStorage parseTxHistory() called');
		if (histObj['_contracts'])
			delete histObj['_contracts'];

		histObj = Object.entries(histObj).map(([hash, data]) => new Tx(data[7]).setHash(hash).fromDataArray(data));
		await this.__lock('txes');
		histObj.forEach(tx => this.txfilter_checkMaxNonce(tx));
		histObj.sort((a, b) => { const diff = a.getTimestamp() - b.getTimestamp(); return diff != 0 ? diff : a.getHash().localeCompare(b.getHash()); });
		await this.txes.bulkLoad(histObj);

		AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
		LogUtilities.toDebugScreen(`parseTxHistory(): our_max_nonce changed to ${this.our_max_nonce}`);

		this.__unlock('txes');
		this.__onUpdate();
	}

	async processTxState(hash, data) {
		LogUtilities.toDebugScreen(`processTxState(hash:${hash}) + `, data);

		await this.__lock('txes');

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

			this.__unlock('txes');
			this._isDAIApprovedForCDAI_cached = undefined;
			this.__onUpdate();
			return;
		}

		// from here on we know it's not a tx we saved by hash

		if (data[0] !== null) { // we have the data, nice
			const ourTx = this.our_address.equals(Buffer.from(data[0], 'hex'));
			const savedState = await AsyncStorage.getItem(`tx_${txStatePrefix}${hash}`);
			if (savedState) {
				await AsyncStorage.removeItem(`tx_${txStatePrefix}${hash}`);
				LogUtilities.toDebugScreen(`processTxState(hash:${hash}) savedState present: `, savedState);
				savedState = JSON.parse(savedState);
			}

			if (ourTx) { // our tx so find by nonce
				const nonce = typeof data[5] === 'string' ? parseInt(data[5]) : data[5];
				const nonceKey = `${txNoncePrefix}${nonce}`;

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

					// update to normal tx (with hash), rename keys, etc.
					await this.txes.replaceTx(tx, newtx, nonceKey, hash, true);

					LogUtilities.toDebugScreen(`processTxState(hash:${hash}) known OUR tx, promoted: `, newtx);

					this.__unlock('txes');
					this._isDAIApprovedForCDAI_cached = undefined;
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

			await this.txes.appendTx(hash, tx, false);

			this.__unlock('txes');
			this._isDAIApprovedForCDAI_cached = undefined;
			this.__onUpdate();
			return;
		}

		// so we have no data, and it's not a known tx. just remember the state.
		// TODO: load savedState (previous tx_state_${hash}), in case this is just an upgrade. not really possible now, but to make it nice it should be done.
		tx = new Tx(data[7])
			.setHash(hash)
			.setTimestamp(data[6]);

		await AsyncStorage.setItem(`tx_${txStatePrefix}${hash}`, JSON.stringify(tx));
		LogUtilities.toDebugScreen(`processTxState(hash: ${hash}) not known tx WITH NO DATA (OOPS...), state saved: `, tx);
		this.__unlock('txes');
		// no onupdate here as we did not save that Tx, umm, in the pool... yet.
	}

	async markNotIncludedTxAsErrorByNonce(nonce) {
		LogUtilities.toDebugScreen(`markNotIncludedTxAsErrorByNonce(nonce:${nonce})`);
		await this.__lock('txes');
		const nonceKey = `${txNoncePrefix}${nonce}`;

		let tx = await this.txes.getTxByHash(nonceKey);
		if (tx) {
			let newtx = tx.deepClone();
			newtx.setState(TxStates.STATE_ERROR);

			await this.txes.replaceTx(tx, newtx, nonceKey, `${txFailPrefix}${this.txes.getItemCount('all')}`, true);

			this.__unlock('txes');
			LogUtilities.toDebugScreen(`markNotIncludedTxAsErrorByNonce(nonce:${nonce}) state updated`);
			this.__onUpdate();
			// TODO: what happens to our_max_nonce now?
		}
		else {
			this.__unlock('txes');
			LogUtilities.toDebugScreen(`markNotIncludedTxAsErrorByNonce(nonce:${nonce}) key not found!`);
			throw new NoSuchTxException(`markNotIncludedTxAsErrorByNonce(): unknown tx nonce: ${nonce}`);
		}
	}

	async getNextNonce() {
		LogUtilities.toDebugScreen(`getNextNonce(): next nonce: ${this.our_max_nonce + 1}`);
		return this.our_max_nonce + 1;
	}

	async clear(batch=false) {
		await this.__lock('txes');
		let tasks = [
			AsyncStorage.setItem(maxNonceKey, '-1'),
			this.txes.wipe()
		];
		await Promise.all(tasks);

		// after this.txes.wipe() ends, we may wanna iterate all the keys and remove rogue tx_state_...

		this.our_max_nonce = -1;

		this.__unlock('txes');

		if (!batch)
			this.__onUpdate();

		this._isDAIApprovedForCDAI_cached = undefined;

		return this;
	}

	async isDAIApprovedForCDAI() { // TODO: i dont think this should be here, really. this is not a storage function...
		if (!this._isDAIApprovedForCDAI_cached) {
			const last_odcda_tx = await this.txes.getLastTx('odcda');
			this._isDAIApprovedForCDAI_cached = !!last_odcda_tx && last_odcda_tx.getTokenOperations('dai', TxTokenOpTypeToName.approval).some(
				x => (x.amount === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
			);
		}

		return this._isDAIApprovedForCDAI_cached;
	}

	async getVerificationData() {
		return await this.getVerificationDataXOR();
	}

	async getVerificationDataXOR() {
		// TODO: this also counts sent txes and failures. we probably should ignore those. we may need to store the count of failures for the `all' index. we should already have the count of sent (toplocks)
		function getCheckpoints(count, offset=0) {
			const hashes = Math.floor(4000 / (32 + 3)); // msg size / hash length (jsoned)
			const computed_count = count - offset; // we assume [offset] hashes to be correct, so we don't checkpoint those, we only take into account the last count - offset hashes

			const checkpoints = [];
			let sum = Math.pow(hashes, Math.log10(computed_count)) / computed_count; // val for i[0]
			for (let i = 1; i <= hashes; ++i) {
				let val = Math.pow(hashes - i, Math.log10(computed_count)) / computed_count;
				checkpoints.push(val);
				sum += val;
			}
			const normalization_factor = 1 / sum;

			let last = count + 1;
			for (let i = checkpoints.length - 1; i >= 0; --i) {
				const diff = Math.round(checkpoints[i] * normalization_factor * computed_count);
				const val = last - (diff > 0 ? diff : 1);
				if (val < 1) {
					return checkpoints.slice(i + 1);
				}
				last = checkpoints[i] = val;
			}

			return checkpoints;
		}

		// TODO: we need to store [last_number_checked(offset), last_hash], so when we get hashes from given offset, we just xor them against last_hash and continue normally.

		await this.__lock('txes');
		const offset = 0;



		//const hashes = await this.txes.getHashes('all', offset);
		const hashes = (await this.txes.getHashes('all', offset)).filter(([x, derp]) => (!x.startsWith(txNoncePrefix) && !x.startsWith(txFailPrefix)));
		const checkpoints = getCheckpoints(hashes.length, offset);
		const ret = [];

		let lasthash = null;
		let checkpoint = 0;
		hashes.forEach(([h, d], idx) => {
			const cb = crypto.createHash('md5').update(`${h}|${d}`).digest(); // we md5-hash those hashes so that: a) they're shorter, b) we can add more data to checksums easily, without making the xored values longer
			// const cb = Buffer.from(h, 'hex');
			if (lasthash) {
				for (let i = lasthash.length - 1; i >= 0; --i)
					lasthash[i] = lasthash[i] ^ cb[i];
			}
			else
				lasthash = cb;

			// LogUtilities.toDebugScreen(`XOR ${idx+1}: [${h}]  ${lasthash.toString('hex')}`);

			if (checkpoints[checkpoint] === idx + 1) {
				ret.push(lasthash.toString('hex'));
				++checkpoint;
			}
		});

		await this.__unlock('txes');

		return {
			'hashes': ret,
			'count': hashes.length,
			'offset': offset,
			'checkpoints': checkpoints
		};
	}

	// async getVerificationDataMD5() {
	// 	function getCheckpoints(count, offset=0) {
	// 		const hashes = Math.floor(4000 / (32 + 3)); // msg size / hash length (jsoned)
	// 		const computed_count = count - offset; // we assume [offset] hashes to be correct, so we don't checkpoint those, we only take into account the last count - offset hashes
	//
	// 		const checkpoints = [];
	// 		let sum = Math.pow(hashes, Math.log10(computed_count)) / computed_count; // val for i[0]
	// 		for (let i = 1; i <= hashes; ++i) {
	// 			let val = Math.pow(hashes - i, Math.log10(computed_count)) / computed_count;
	// 			checkpoints.push(val);
	// 			sum += val;
	// 		}
	// 		const normalization_factor = 1 / sum;
	//
	// 		let last = count + 1;
	// 		for (let i = checkpoints.length - 1; i >= 0; --i) {
	// 			const diff = Math.round(checkpoints[i] * normalization_factor * computed_count);
	// 			const val = last - (diff > 0 ? diff : 1);
	// 			if (val < 1) {
	// 				return checkpoints.slice(i + 1);
	// 			}
	// 			last = checkpoints[i] = val;
	// 		}
	//
	// 		return checkpoints;
	// 	}
	//
	// 	const count = this.txes.getItemCount('all');
	// 	const checkpoints = getCheckpoints(count, 0);
	//
	// 	LogUtilities.toDebugScreen(`TxStorage getVerificationData() checkpoints (cnt:${count} off:0):`, checkpoints);
	//
	// 	// const hashes = await this.txes.getHashesAt(checkpoints, 'all');
	// 	const hashes = await this.txes.getHashes('all');
	// 	const ret = [];
	// 	let lasthash = null;
	// 	let checkpoint = 0;
	// 	hashes.forEach((h, idx) => {
	// 		const ch = crypto.createHash('md5').update(lasthash ? `${lasthash}${h}` : h).digest('hex');
	// 		if (checkpoints[checkpoint] === idx + 1) {
	// 			ret.push(ch);
	// 			++checkpoint;
	// 		}
	// 		lasthash = ch;
	// 	});
	//
	// 	return {
	// 		//'hashes': hashes,
	// 		'hashes': ret,
	// 		'count': count,
	// 		'offset': 0
	// 	};
	// }


	async processTxSync(data) {
		// LogUtilities.toDebugScreen('processTxSync(): received txsync data:', data);
		if ('_contracts' in data)
			delete data['_contracts'];

		data = Object.entries(data).map(([hash, txdata]) => new Tx(txdata[7]).setHash(hash).fromDataArray(txdata));
		data.sort((a, b) => { const diff = a.getTimestamp() - b.getTimestamp(); return diff != 0 ? diff : a.getHash().localeCompare(b.getHash()); });

		// LogUtilities.toDebugScreen('processTxSync(): txsync data:', data);

		await this.__lock('txes');

		const removeKeys = [];

		let changed = 0;

		for (let i = 0; i < data.length; ++i) {
			const tx = data[i];
			let oldTx;
			const ourTx = (tx.from_addr && this.our_address.equals(tx.from_addr));
			removeKeys.push(`tx_${txStatePrefix}${tx.getHash()}`);

			if (ourTx) {
				const nonceKey = `${txNoncePrefix}${tx.getNonce()}`;
				oldTx = await this.txes.getTxByHash(nonceKey);
				if (oldTx) {
					// replacetx
					LogUtilities.toDebugScreen('processTxSync(): found OUR tx by nonce: ', oldTx);
					LogUtilities.toDebugScreen('processTxSync(): to be replaced with: ', tx);
					await this.txes.replaceTx(oldTx, tx, nonceKey, tx.getHash(), true);
					changed++;
					return;
				}
			}

			oldTx = await this.txes.getTxByHash(tx.getHash());

			if (oldTx) {
				// updateTx, perhaps after comparing if changed
				LogUtilities.toDebugScreen('processTxSync(): found tx by hash: ', oldTx);
				if (oldTx.getState() !== tx.getState()) {
					LogUtilities.toDebugScreen('processTxSync(): to be replaced with: ', tx);
					await this.txes.replaceTx(oldTx, tx, nonceKey, tx.getHash(), false);
					changed++;
				}
				else
					LogUtilities.toDebugScreen('processTxSync(): replacement has same state, skipping: ', tx);
				return;
			}

			LogUtilities.toDebugScreen('processTxSync(): inserting new, unknown tx: ', tx);

			await this.txes.appendTx(tx.getHash(), tx, false);
			changed++;
			// try to find by txnonce if this is our tx.
			// if found, replacetx.
			// if not found, try to find by hash, if it's there perhaps check if same, if not update. or just update(?)
			// if still not found, just appendTx().
		}
		LogUtilities.toDebugScreen(`processTxSync(): removeKeys: ${removeKeys.join()}`);
		await AsyncStorage.multiRemove(removeKeys);

		this.__unlock('txes');

		if (changed > 0)
			this.__onUpdate();
	}


	async debugDumpAllTxes(index='all') {
		return await this.txes.debugDumpAllTxes(index);
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
