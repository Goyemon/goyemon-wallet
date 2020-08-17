'use strict';
import crypto from 'crypto';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalConfig from '../config.json';
import LogUtilities from '../utilities/LogUtilities';

const TxStates = {
  STATE_GETH_ERROR: -1,
  STATE_NEW: 0,
  STATE_PENDING: 1,
  STATE_INCLUDED: 2,
  STATE_CONFIRMED: 3
};

const TxTokenOpTypeToName = {
  // names inside txhistory object
  transfer: 'tr',
  approval: 'appr',
  failure: 'failure',
  mint: 'mint',
  redeem: 'redeem',
  eth2tok: 'eth2tok',
  tok2eth: 'tok2eth',
  U2swap: 'U2swap',
  PTdeposited: 'PTdep',
  PTdepositedAndCommitted: 'PTdepc',
  PTsponsorshipDeposited: 'PTspdep',
  PTwithdrawn: 'PTwdrw',
  PTopenDepositWithdrawn: 'PTopdepwi',
  PTsponsorshipAndFeesWithdrawn: 'PTspafwi',
  PTcommittedDepositWithdrawn: 'PTcodewi',
  PTrewarded: 'PTrew'
};

// ========== helper functions ==========
function dropHexPrefix(hex) {
  return typeof hex === 'string'
    ? hex.startsWith('0x')
      ? hex.substr(2)
      : hex
    : hex;
}

function hexToBuf(hex) {
  return typeof hex === 'string'
    ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex')
    : null;
}

// ========== locks ==========
class asyncLocks {
  constructor() {
    this.locks = {};
  }

  async lock(name) {
    let l = this.locks[name];
    while (
      l &&
      l.promise // we wait as long as there is a promise to be awaited
    )
      await l.promise; // the other "thread" will resolve and clear that promise.

    if (!l) l = this.locks[name] = {};

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
    delete l.promise;
    delete l.resolve;
    delete l.reject;
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

const storage_bucket_size = Math.floor(4096 / (64 + 1));
class PersistTxStorageAbstraction {
  constructor(prefix = '') {
    LogUtilities.toDebugScreen(
      'PersistTxStorageAbstraction constructor called'
    );

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

  __init_lock() {
    // locks are noop for now, locking happens in TxStorage.
    return;
  }

  async __lock() {
    return;
  }

  __unlock() {
    return;
  }

  init_storage(name_to_filter_map, init_finish_callback) {
    let load_count = 0;
    const failed_nonces = {};

    const checkFinish = () => {
      load_count--;

      if (load_count == 0) {
        LogUtilities.toDebugScreen(
          `PersistTxStorageAbstraction init_storage(): tasks executed. counts:${JSON.stringify(
            this.counts
          )} toplocked:${JSON.stringify(this.toplocked_per_filter)}`
        );

        if (this.debug) {
          let temp_debug_bucket_names = [];
          Object.keys(this.counts).forEach((x) => {
            for (
              let i = 0;
              i < Math.ceil(this.counts[x] / storage_bucket_size) + 1;
              ++i
            )
              temp_debug_bucket_names.push(`${this.prefix}i${x}${i}`);
          });

          AsyncStorage.multiGet(temp_debug_bucket_names).then((x) => {
            x.sort((a, b) => a[0].localeCompare(b[0]));
            x.forEach(([n, v]) =>
              LogUtilities.toDebugScreen(`${n} --> ${bstats(v)}`)
            );
          });
        }

        if (init_finish_callback) init_finish_callback(failed_nonces);
      }
    };

    const bstats = (buck) => {
      if (typeof buck !== 'string') return JSON.stringify(buck);

      let itemlens = {};
      let cnt = 0;
      buck.split(',').forEach((x) => {
        itemlens[x.length] = itemlens[x.length] ? itemlens[x.length] + 1 : 1;
        ++cnt;
      });

      return `cnt:${cnt} lengths:${JSON.stringify(itemlens)}`;
    };

    const countToplocked = (name, bucketnum) => {
      // also gets failed nonces until first included
      this.__getKey(
        `${this.prefix}i${name}${bucketnum}`,
        this.__decodeBucket
      ).then((x) => {
        for (let i = x.length - 1; i >= 0; --i) {
          if (x[i].startsWith(txNoncePrefix)) this.toplocked_per_filter[name]++;
          else if (x[i].startsWith(txFailPrefix))
            // ${txFailPrefix}${nonce}_${blah}
            failed_nonces[
              parseInt(x[i].slice(txFailPrefix.length, x[i].indexOf('_') - 1))
            ] = true;
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
    };

    const load_index_data = function (name) {
      load_count++;

      this.__init_lock(name);
      this.toplocked_per_filter[name] = 0;

      AsyncStorage.getItem(`${this.prefix}i${name}c`).then((x) => {
        this.counts[name] = x ? parseInt(x) : 0;
        if (this.counts[name] > 0) {
          const lastBucketNum = Math.floor(
            (this.counts[name] - 1) / storage_bucket_size
          );
          countToplocked(name, lastBucketNum);
        } else checkFinish();
      });
    }.bind(this);

    load_index_data('all');

    Object.entries(name_to_filter_map).forEach(([name, filter]) => {
      this.filters[name] = filter;

      load_index_data(name);
    });
  }

  async __getKey(key, processfunc) {
    // TODO: needs cache cleaning
    if (!this.cache[key]) {
      const val = await AsyncStorage.getItem(key);
      if (this.debug && (val === null || val === undefined))
        LogUtilities.toDebugScreen(
          `PersistTxStorageAbstraction __getKey(${key}) warning - returned null!`
        );

      this.cache[key] = processfunc ? processfunc(val) : val;
    }

    return this.cache[key];
  }

  async __setKey(key, v, processfunc) {
    this.cache[key] = v;

    await AsyncStorage.setItem(key, processfunc ? processfunc(v) : v);
  }

  async __removeKey(key) {
    // there's a bit of a race condition. if we removeKey and at the same time getKey, remove will clear it from cache, but not from storage yet. getKey will potentially fetch it from storage then, before removeKey removes it from there.
    delete this.cache[key];

    await AsyncStorage.removeItem(key);
  }

  __decodeBucket(b) {
    return b.split(',');
  }
  __encodeBucket(ba) {
    return ba.join(',');
  }
  __decodeTx(hash, data) {
    if (!data) return null;

    data = JSON.parse(data);

    return new Tx(data[7]).setHash(hash).fromDataArray(data, false);
  }

  async getTxByNum(num, index = 'all') {
    const bucket_num = Math.floor(num / storage_bucket_size);
    const bucket_pos = num % storage_bucket_size;

    if (this.debug) {
      if (!this.counts[index])
        LogUtilities.toDebugScreen(
          `PersistTxStorageAbstraction getTxByNum() requested data from index that has no count defined:${index}`
        );
      else if (num >= this.counts[index])
        LogUtilities.toDebugScreen(
          `PersistTxStorageAbstraction getTxByNum() requested data index:${index} num:${num}, but count is ${this.counts[index]}`
        );
    }

    const bucket = await this.__getKey(
      `${this.prefix}i${index}${bucket_num}`,
      this.__decodeBucket
    );
    return await this.getTxByHash(bucket[bucket_pos]);
  }

  async getTxByHash(hash) {
    return await this.__getKey(`${this.prefix}_${hash}`, (data) =>
      this.__decodeTx(hash, data)
    );
  }

  async getLastTx(index = 'all') {
    if (this.counts[index] == 0) return null;

    const bucket_num = Math.floor(
      (this.counts[index] - 1) / storage_bucket_size
    );
    const bucket = await this.__getKey(
      `${this.prefix}i${index}${bucket_num}`,
      this.__decodeBucket
    );

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

  async getHashes(index = 'all', offset = 0) {
    // currently also precaches top 128 txes.
    // TODO: this perhaps could use cache.
    await this.__lock(index);

    if (this.counts[index] == 0) {
      this.__unlock(index);
      return [];
    }

    const high_bucket = Math.floor(
      (this.counts[index] - 1) / storage_bucket_size
    );
    const low_bucket = Math.floor(offset / storage_bucket_size);
    const low_bucket_off = offset % storage_bucket_size;

    const bucketnames = [];
    for (let i = low_bucket; i <= high_bucket; ++i)
      bucketnames.push(`${this.prefix}i${index}${i}`);

    const bucketdata = await AsyncStorage.multiGet(bucketnames); // looks like the results returned are in the same order we're requesting them https://github.com/react-native-community/async-storage/blob/master/lib/AsyncStorage.js#L266
    LogUtilities.toDebugScreen(
      `getHashes(): bucketnames.length = ${bucketnames.length}, bucketdata.length == ${bucketdata.length}`
    );

    const ret = [];
    for (let i = 0; i < bucketnames.length; ++i) {
      let add_items;
      const bd = this.__decodeBucket(bucketdata[i][1]);
      this.cache[bucketdata[i][0]] = bd; // precache all the buckets

      //LogUtilities.toDebugScreen(`getHashRanges(): bucketdata[${i}] = ${bd}`);

      if (i == 0) add_items = bd.slice(low_bucket_off);
      else add_items = bd;

      ret.splice(ret.length, 0, ...add_items);
    }

    // LogUtilities.toDebugScreen(`getHashes(): ret == ${ret}}`);

    const txdata = await AsyncStorage.multiGet(
      ret.map((x) => `${this.prefix}_${x}`)
    );

    LogUtilities.toDebugScreen(
      `getHashes(): txdata.length == ${txdata.length}, ret.length == ${ret.length}`
    );
    for (let i = 0; i < ret.length; ++i) {
      try {
        const tx = JSON.parse(txdata[i][1]);
        // precache top 64 txes
        if (i >= ret.length - 128) {
          this.cache[txdata[i][0]] = new Tx(tx[7])
            .setHash(txdata[i][0].slice(this.prefix.length + 1))
            .fromDataArray(tx, false);
        }
        // /precache
        ret[i] = [ret[i], tx[7]];
      } catch (e) {
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

  async updateTxDataIfExists(hash, tx) {
    // TODO: does not re-check indices, so be careful if anything can change there.

    const key = `${this.prefix}_${hash}`;
    const oldTx = await this.__getKey(key, (data) =>
      this.__decodeTx(hash, data)
    );
    if (oldTx) {
      await this.__setKey(key, tx, JSON.stringify);
      return oldTx;
    }

    return null;
  }

  async appendTx(hash, tx, toplock = false) {
    // run filters to see which indices this goes in. for each index, append to the last bucket (make sure we create a new one if it spills)
    let append_indices = ['all'];
    Object.entries(this.filters).forEach(([index, filterfunc]) => {
      if (filterfunc(tx)) append_indices.push(index);
    });

    if (this.debug)
      LogUtilities.toDebugScreen(
        `appendTx(${hash}): matches indices:${append_indices
          .map((x) => `${x}: ${this.counts[x]}`)
          .join()}; tx:${JSON.stringify(tx)})`
      );

    let tasks = [this.__setKey(`${this.prefix}_${hash}`, tx, JSON.stringify)];

    append_indices.forEach((x) => {
      tasks.push(
        (async (index) => {
          let localtasks = [];

          await this.__lock(index);
          const last_bucket_num = Math.floor(
            Math.max(0, this.counts[index] - 1) / storage_bucket_size
          );

          if (toplock) {
            // easy, just insert at the top as last element
            const bucket_key = `${this.prefix}i${index}${last_bucket_num}`;
            if (this.counts[index] % storage_bucket_size == 0) {
              // new bucket
              if (this.debug)
                LogUtilities.toDebugScreen(
                  `PersistTxStorageAbstraction appendTx(top): index:${index} item_num:${this.counts[index]} new bucket, last_bucket_num:${last_bucket_num}`
                );

              localtasks.push(
                this.__setKey(bucket_key, [hash], this.__encodeBucket)
              );
            } else {
              // add to bucket
              if (this.debug)
                LogUtilities.toDebugScreen(
                  `PersistTxStorageAbstraction appendTx(top): index:${index} item_num:${this.counts[index]} last_bucket_num:${last_bucket_num}`
                );

              localtasks.push(
                this.__getKey(bucket_key, this.__decodeBucket).then(
                  async (x) => {
                    x.push(hash);
                    await this.__setKey(bucket_key, x, this.__encodeBucket);
                  }
                )
              );
            }
          } else {
            // inserting in the middle, so we may need to carry to later buckets
            const global_position =
              this.counts[index] - this.toplocked_per_filter[index]; // this is actually destination position now, not count
            const bucket_num = Math.floor(
              global_position / storage_bucket_size
            );
            const bucket_pos = global_position % storage_bucket_size;

            if (this.debug)
              LogUtilities.toDebugScreen(
                `PersistTxStorageAbstraction appendTx(): index:${index} item_num:${global_position} bucket_num:${bucket_num} last_bucket_num:${last_bucket_num} toplocked:${this.toplocked_per_filter[index]}`
              );

            localtasks.push(
              (async () => {
                // sadly we have to do it one by one, because to carry last velue of bucket x to x+1 we need to know it... therefore fetch, insert, pop(), then we can move onto next bucket
                let carry = null; // this gets moved to another bucket, if necessary

                for (let i = bucket_num; i <= last_bucket_num; ++i) {
                  const bucket_key = `${this.prefix}i${index}${i}`;
                  const x =
                    this.counts[index] > 0
                      ? await this.__getKey(bucket_key, this.__decodeBucket)
                      : [];

                  if (this.debug)
                    LogUtilities.toDebugScreen(
                      `PersistTxStorageAbstraction appendTx(): index:${index} bucket:${i} len:${
                        x.length
                      } carry:${carry !== null}${
                        i == bucket_num ? ` splice_position:${bucket_pos}` : ''
                      }`
                    );

                  if (carry !== null) {
                    // add what we carried from previous, if anything
                    x.unshift(carry);
                    carry = null;
                  }

                  if (i == bucket_num) {
                    // this is the bucket we're inserting our initial value
                    x.splice(bucket_pos, 0, hash);
                  }

                  if (x.length > storage_bucket_size) {
                    // need to carry
                    carry = x.pop();
                  }

                  await this.__setKey(bucket_key, x, this.__encodeBucket);
                }

                if (carry !== null) {
                  // looks like the last bucket overflowed, so we need to create another bucket too.
                  if (this.debug)
                    LogUtilities.toDebugScreen(
                      `PersistTxStorageAbstraction appendTx(): index:${index} new bucket:${
                        last_bucket_num + 1
                      } carry:${carry !== null}`
                    );

                  const bucket_key = `${this.prefix}i${index}${
                    last_bucket_num + 1
                  }`;
                  await this.__setKey(bucket_key, [hash], this.__encodeBucket);
                }
              })()
            );
          }

          const new_count = this.counts[index] + 1;
          localtasks.push(
            this.__setKey(`${this.prefix}i${index}c`, new_count.toString())
          );

          await Promise.all(localtasks);
          this.counts[index] = new_count;

          if (toplock) this.toplocked_per_filter[index]++;

          this.__unlock(index);
        })(x)
      );
    });

    await Promise.all(tasks);
  }

  async bulkLoad(txarray) {
    // TODO: add locking
    var index_counts = {
      all: 0
    };
    var index_buckets = {
      all: []
    };

    const startTime = Date.now();

    function add_to_index(index, hash) {
      const buck = index_buckets[index];
      if (index_counts[index] % storage_bucket_size == 0) buck.push([hash]);
      else buck[buck.length - 1].push(hash);

      index_counts[index]++;
    }

    Object.keys(this.filters).forEach((index) => {
      index_counts[index] = 0;
      index_buckets[index] = [];
    });

    let tasks = [];
    txarray.forEach((tx) => {
      const hash = tx.getHash();
      add_to_index('all', hash);

      Object.entries(this.filters).forEach(([index, filterfunc]) => {
        if (filterfunc(tx)) add_to_index(index, hash);
      });

      tasks.push([`${this.prefix}_${hash}`, JSON.stringify(tx)]);
    });

    Object.entries(index_counts).forEach(([index, count]) => {
      tasks.push([`${this.prefix}i${index}c`, count.toString()]);
    });

    Object.entries(index_buckets).forEach(([index, buckets]) => {
      buckets.forEach((bucket, idx) => {
        tasks.push([
          `${this.prefix}i${index}${idx}`,
          this.__encodeBucket(bucket)
        ]);
      });
    });

    LogUtilities.toDebugScreen(
      `PersistTxStorageAbstraction bulkLoad(): tasks to execute:${
        tasks.length
      }, index counts:${JSON.stringify(index_counts)}`
    );

    await AsyncStorage.multiSet(tasks);
    this.counts = index_counts;
    this.cache = {};

    LogUtilities.toDebugScreen(
      `PersistTxStorageAbstraction bulkLoad(): tasks executed. load time:${
        Date.now() - startTime
      }ms`
    );
  }

  async wipe() {
    // TODO: add locking
    let indices = Object.keys(this.filters);
    let removekeys = [];

    indices.forEach((x) => {
      for (
        let i = 0;
        i < Math.floor((this.counts[x] - 1) / storage_bucket_size);
        ++i
      )
        removekeys.push(`${this.prefix}i${x}${i}`); //tasks.push(AsyncStorage.removeItem(`${this.prefix}i${x}${i}`)); // remove buckets

      removekeys.push(`${this.prefix}i${x}c`); //tasks.push(AsyncStorage.removeItem(`${this.prefix}i${x}c`)); // and the count
    });

    // now we only have index `all' to go through, but we actually need to read it and remove all hashes
    let readtasks = [];
    removekeys.push(`${this.prefix}iallc`); // tasks.push(AsyncStorage.removeItem(`${this.prefix}iallc`));
    for (
      let i = 0;
      i < Math.floor((this.counts.all - 1) / storage_bucket_size);
      ++i
    ) {
      removekeys.push(`${this.prefix}iall${i}`); // tasks.push(AsyncStorage.removeItem(`${this.prefix}iall${i}`));
      readtasks.push(
        this.__getKey(`${this.prefix}iall${i}`, this.__decodeBucket).then(
          (bucket) => {
            bucket.forEach(
              (x) => removekeys.push(`${this.prefix}_${x}`) // tasks.push(AsyncStorage.removeItem(`${this.prefix}_${x}`))
            );
          }
        )
      );
    }
    LogUtilities.toDebugScreen(
      `PersistTxStorageAbstraction wipe(): readtasks to execute:${
        readtasks.length
      }, index counts:${JSON.stringify(this.counts)}`
    );
    await Promise.all(readtasks); // first we run readtasks to make sure we've processed all the buckets, this should also fill tasks with removes.
    LogUtilities.toDebugScreen(
      `PersistTxStorageAbstraction wipe(): remove tasks to execute:${removekeys.length}`
    );
    await AsyncStorage.multiRemove(removekeys); // aand we removed everything now.

    Object.keys(this.counts).forEach((x) => (this.counts[x] = 0));
    this.cache = {};
  }

  getItemCount(index = 'all') {
    return this.counts[index];
  }

  async __replaceKeyInIndex(
    oldkey,
    newkey,
    index = 'all',
    toplockremove = false
  ) {
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

    const last_bucket = Math.floor(
      (this.counts[index] - 1) / storage_bucket_size // this func should not be called for empty indices anyway, so not checking if counts[idx] > 0
    );

    if (!toplockremove) {
      let bucket_count = last_bucket;

      if (this.debug)
        LogUtilities.toDebugScreen(
          `PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): last bucket id: ${last_bucket}`
        );

      while (bucket_count >= 0) {
        let bucket = await this.__getKey(
          `${this.prefix}i${index}${bucket_count}`,
          this.__decodeBucket
        );
        let pos = bucket.indexOf(oldkey);
        if (pos >= 0) {
          if (this.debug)
            LogUtilities.toDebugScreen(
              `PersistTxStorageAbstraction __replaceKeyInIndex(): found item at position ${pos} in bucket ${bucket_count}`
            );

          bucket[pos] = newkey;
          await this.__setKey(
            `${this.prefix}i${index}${bucket_count}`,
            bucket,
            this.__encodeBucket
          );

          this.__unlock(index);
          return;
        }

        bucket_count--;
      }
    } else {
      // here comes the fun!
      const destination_pos =
        this.counts[index] - this.toplocked_per_filter[index];
      const destination_bucket = Math.floor(
        destination_pos / storage_bucket_size
      );
      const destination_bucket_pos = destination_pos % storage_bucket_size;

      // first, find the item.
      let item_bucket_pos;
      let item_bucket_num;
      let bucket;

      for (
        item_bucket_num = last_bucket;
        item_bucket_num >= 0;
        --item_bucket_num
      ) {
        bucket = await this.__getKey(
          `${this.prefix}i${index}${item_bucket_num}`,
          this.__decodeBucket
        );
        item_bucket_pos = bucket.indexOf(oldkey);
        if (item_bucket_pos >= 0) break;
      }

      if (item_bucket_pos >= 0) {
        // we found it!
        if (this.debug)
          LogUtilities.toDebugScreen(
            `PersistTxStorageAbstraction __replaceKeyInIndex(${index}): found item at position ${item_bucket_pos} in bucket ${item_bucket_num}, moving to ${destination_bucket_pos}@${destination_bucket}, toplocked:${this.toplocked_per_filter[index]}`
          );

        if (
          item_bucket_num < destination_bucket ||
          (item_bucket_num == destination_bucket &&
            item_bucket_pos < destination_bucket_pos)
        ) {
          this.__unlock(index);
          LogUtilities.toDebugScreen(
            `PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): item was already not in toplocks`
          );
          throw new Error(`key "${oldkey}" not found in the index "${index}"`);
        }

        let bgtasks = [];

        bucket.splice(item_bucket_pos, 1); // remove from current bucket. if it was a full bucket, it's now lacking one item

        for (let i = item_bucket_num; i > destination_bucket; --i) {
          // we fetch early buckets until we reach destination, to shift items one right
          if (this.debug)
            LogUtilities.toDebugScreen(
              `PersistTxStorageAbstraction __replaceKeyInIndex(${index}): last item of bucket ${
                i - 1
              } -> first item of bucket ${i}`
            );

          const prev_bucket = await this.__getKey(
            `${this.prefix}i${index}${i - 1}`,
            this.__decodeBucket
          );

          bucket.unshift(prev_bucket.pop()); // move last item of prev bucket as first of current
          bgtasks.push(
            this.__setKey(
              `${this.prefix}i${index}${i}`,
              bucket,
              this.__encodeBucket
            )
          ); // save current bucket, no need to touch previous yet

          bucket = prev_bucket;
        }

        if (this.debug)
          LogUtilities.toDebugScreen(
            `PersistTxStorageAbstraction __replaceKeyInIndex(${index}): inserting ${newkey} at ${destination_bucket_pos} in bucket ${destination_bucket}. end.`
          );

        bucket.splice(destination_bucket_pos, 0, newkey);
        bgtasks.push(
          this.__setKey(
            `${this.prefix}i${index}${destination_bucket}`,
            bucket,
            this.__encodeBucket
          )
        );

        await Promise.all(bgtasks); // now write it all.

        this.toplocked_per_filter[index]--;

        this.__unlock(index);
        return;
      }
    }

    // this.__unlock(index);
    // LogUtilities.toDebugScreen(
    //   `PersistTxStorageAbstraction __replaceKeyInIndex(${oldkey}, ${newkey}, ${index}, ${toplockremove}): item not found...`
    // );
    // throw new Error(`key "${oldkey}" not found in the index "${index}"`);
  }

  async removeKey(oldkey, index = 'all') {
    // not used yet; will be used when indexDiff is tested and we actually have to remove stuff from some indices.
    await this.__lock(index);

    const last_bucket_index = Math.floor(
      (this.counts[index] - 1) / storage_bucket_size
    ); // not exactly count, more like index and those go from 0
    const bgtasks = [];

    let current_bucket = last_bucket_index;
    const buckets = {}; // since those arent huge, let's just precache them
    while (current_bucket >= 0) {
      let bucket = await this.__getKey(
        `${this.prefix}i${index}${current_bucket}`
      );
      let pos = bucket.indexOf(oldkey);

      if (pos >= 0) {
        // item found
        // TODO: this needs to check if the item is toplocked, i.e. our absolute position is >= this.counts[index] - this.toplocked_per_filter[index] - 1, if it is, we need to decremet toplocked count
        // TODO: also needs some logging.
        bucket.splice(pos, 1); // we remove that item and
        for (; current_bucket < last_bucket_index; ++current_bucket) {
          // for each bucket counting up from current,
          bucket.push(buckets[current_bucket + 1].unshift()); // we push an item unshifted from the next bucket (so, we're basically shifting them by one item left to make buckets full again)
          bgtasks.push(
            this.__setKey(
              `${this.prefix}i${index}${current_bucket}`,
              bucket,
              this.__encodeBucket
            )
          );
          bucket = buckets[current_bucket + 1];
        }
        bgtasks.push(
          this.__setKey(
            `${this.prefix}i${index}${current_bucket}`,
            bucket,
            this.__encodeBucket
          )
        );

        this.counts[index]--;
        bgtasks.push(
          AsyncStorage.setItem(
            `${this.prefix}i${index}c`,
            this.counts[index].toString()
          )
        );

        await Promise.all(bgtasks); // now write it all.

        this.__unlock(index);
        return;
      }

      buckets[current_bucket] = bucket;
      current_bucket--;
    }

    this.__unlock(index);
    throw new Error(`key "${oldkey}" not found in the index "${index}"`);
  }

  __indexDiff(oldtx, newtx) {
    const ret = {
      common: [],
      add: [],
      remove: []
    };

    const oldidx = {};
    Object.entries(this.filters).forEach(([index, filterfunc]) => {
      if (filterfunc(oldtx)) oldidx[index] = 1;
    });

    Object.entries(this.filters).forEach(([index, filterfunc]) => {
      if (filterfunc(newtx)) {
        if (oldidx[index]) {
          oldidx[index] = 0;
          ret.common.push(index);
        } else ret.add.push(index);
      }
    });

    Object.entries(oldidx).forEach(([index, x]) => {
      if (x) ret.remove.push(index);
    });

    return ret;
  }

  async replaceTx(oldtx, newtx, oldhash, newhash, toplockremove = false) {
    // for now this can only be called when changing nonce_xxx to proper txhash, so when 'sent' state goes into included. soon added: nonce_xxx to fail_xxx when a tx errors out (and we dont want to keep the nonce_xxx key as it'll get overwritten)

    const indexDiff = this.__indexDiff(oldtx, newtx);
    // TODO: index differences disregarded for now.
    // also, what if new tx goes into new indices? at which position should it be?

    if (this.debug) {
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction replaceTx(): replace oldtx ${oldhash} -> newtx ${newhash}`
      );
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction replaceTx(): oldtx:${JSON.stringify(
          oldtx
        )}`
      );
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction replaceTx(): newtx:${JSON.stringify(
          newtx
        )}`
      );
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction replaceTx(): indexDiff:${JSON.stringify(
          indexDiff
        )}`
      );
    }

    await this.__setKey(`${this.prefix}_${newhash}`, newtx, JSON.stringify);
    await this.__removeKey(`${this.prefix}_${oldhash}`);

    await Promise.all(
      [this.__replaceKeyInIndex(oldhash, newhash, 'all', toplockremove)].concat(
        Object.entries(this.filters).map(([index, filterfunc]) => {
          if (filterfunc(newtx))
            return this.__replaceKeyInIndex(
              oldhash,
              newhash,
              index,
              toplockremove
            );
        })
      )
    );

    // throw new Error("not implemented yet");
  }

  async updateTx(oldtx, newtx, hash) {
    // no hash change, therefore sent stays sent (nonce_xxx) or included stays included (txhash)

    const indexDiff = this.__indexDiff(oldtx, newtx);
    // TODO: index differences disregarded for now.

    if (this.debug) {
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction updateTx(): replace (${hash}) oldtx:${JSON.stringify(
          oldtx
        )} with newtx:${JSON.stringify(newtx)}`
      );
      LogUtilities.toDebugScreen(
        `PersistTxStorageAbstraction updateTx(): indexDiff:${JSON.stringify(
          indexDiff
        )}`
      );
    }

    await this.__setKey(`${this.prefix}_${hash}`, newtx, JSON.stringify);

    //throw new Error("not implemented yet");
  }

  async debugDumpAllTxes(index = 'all') {
    const bucket_count = Math.floor(
      (this.counts[index] - 1) / storage_bucket_size
    );
    const bucketnames = [];
    for (let i = 0; i <= bucket_count; ++i)
      bucketnames.push(`${this.prefix}i${index}${i}`);

    const hashes_in_order = [];

    const buckets = {};
    (await AsyncStorage.multiGet(bucketnames)).forEach(
      ([k, v]) => (buckets[k] = v)
    );
    bucketnames.forEach((n) => {
      this.__decodeBucket(buckets[n]).forEach((hash) =>
        hashes_in_order.push(`${this.prefix}_${hash}`)
      );
    });
    // delete(buckets);

    const txes = [];
    (await AsyncStorage.multiGet(hashes_in_order)).forEach(
      ([k, v]) => (txes[k] = v)
    );

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
// class InvalidStateTxException extends TxException {}
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
  constructor(arr) {
    super();
    [this.minter, this.mintUnderlying, this.mintAmount] = arr;
    // this.minter = arr[0]; this.mintAmount = arr[1]; this.mintUnderlying = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.mint]: [
        this.minter,
        this.mintUnderlying,
        this.mintAmount
      ]
    };
  }
}

class TxTokenRedeemOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.redeemer, this.redeemUnderlying, this.redeemAmount] = arr;
    // this.redeemer = arr[0]; this.redeemAmount = arr[1]; this.redeemUnderlying = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.redeem]: [
        this.redeemer,
        this.redeemUnderlying,
        this.redeemAmount
      ]
    };
  }
}

class TxTokenTransferOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.to_addr, this.amount] = arr;
    // this.from_addr = arr[0]; this.to_addr = arr[1]; this.amount = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.transfer]: [
        this.from_addr,
        this.to_addr,
        this.amount
      ]
    };
  }
}

class TxTokenApproveOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.spender, this.approver, this.amount] = arr;
    // this.approver = arr[0]; this.spender = arr[1]; this.amount = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.approval]: [this.spender, this.approver, this.amount]
    };
  }
}

class TxTokenFailureOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.error, this.info, this.detail] = arr;
    // this.error = arr[0]; this.info = arr[1]; this.detail = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.failure]: [this.error, this.info, this.detail]
    };
  }
}

class TxTokenEth2TokOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.eth_sold, this.tok_bought] = arr;
    // this.from_addr = arr[0]; this.eth_sold = arr[1]; this.tok_bought = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.eth2tok]: [
        this.from_addr,
        this.eth_sold,
        this.tok_bought
      ]
    };
  }
}

class TxTokenTok2EthOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.tok_sold, this.eth_bought] = arr;
    // this.from_addr = arr[0]; this.tok_sold = arr[1]; this.eth_bought = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.tok2eth]: [
        this.from_addr,
        this.tok_sold,
        this.eth_bought
      ]
    };
  }
}

class TxTokenU2swapOp extends TxTokenOp {
  constructor(arr) {
    super();
    [
      this.sender,
      this.amount0In,
      this.eth_sold,
      this.tok_bought,
      this.amount1Out,
      this.from_addr
    ] = arr;
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.U2swap]: [
        this.sender,
        this.amount0In,
        this.eth_sold,
        this.tok_bought,
        this.amount1Out,
        this.from_addr
      ]
    };
  }
}

class TxTokenPTdepositedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTdeposited]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTdepositedAndCommittedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTdepositedAndCommitted]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTsponsorshipDepositedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTsponsorshipDeposited]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTwithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTwithdrawn]: [this.withdrawer, this.withdrawAmount]
    };
  }
}

class TxTokenPTopenDepositWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTopenDepositWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTsponsorshipAndFeesWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTcommittedDepositWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTcommittedDepositWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTrewardedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.winner, this.winnings] = arr;
    // this.winner = arr[0]; this.winnings = arr[1];
  }

  toJSON() {
    return { [TxTokenOpTypeToName.PTrewarded]: [this.winner, this.winnings] };
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
const TxTokenOpNameToClass = {
  // name -> tokenop storage class
  [TxTokenOpTypeToName.transfer]: TxTokenTransferOp,
  [TxTokenOpTypeToName.approval]: TxTokenApproveOp,
  [TxTokenOpTypeToName.failure]: TxTokenFailureOp,
  [TxTokenOpTypeToName.mint]: TxTokenMintOp,
  [TxTokenOpTypeToName.redeem]: TxTokenRedeemOp,
  [TxTokenOpTypeToName.eth2tok]: TxTokenEth2TokOp,
  [TxTokenOpTypeToName.tok2eth]: TxTokenTok2EthOp,
  [TxTokenOpTypeToName.U2swap]: TxTokenU2swapOp,
  [TxTokenOpTypeToName.PTdeposited]: TxTokenPTdepositedOp,
  [TxTokenOpTypeToName.PTdepositedAndCommitted]: TxTokenPTdepositedAndCommittedOp,
  [TxTokenOpTypeToName.PTsponsorshipDeposited]: TxTokenPTsponsorshipDepositedOp,
  [TxTokenOpTypeToName.PTwithdrawn]: TxTokenPTwithdrawnOp,
  [TxTokenOpTypeToName.PTopenDepositWithdrawn]: TxTokenPTopenDepositWithdrawnOp,
  [TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn]: TxTokenPTsponsorshipAndFeesWithdrawnOp,
  [TxTokenOpTypeToName.PTcommittedDepositWithdrawn]: TxTokenPTcommittedDepositWithdrawnOp,
  [TxTokenOpTypeToName.PTrewarded]: TxTokenPTrewardedOp
};

class Tx {
  constructor(state) {
    this.from_addr = this.to_addr = this.value = this.gas = this.gasPrice = this.timestamp = this.nonce = this.hash = null;
    this.state = state !== undefined ? state : null;
    this.tokenData = {};
    this.data = {}; // for additional items, such as transaction input field
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
    // misleading now; means transaction input field
    this.data.data = data;
    return this;
  }

  tempDropData() {
    delete this.data.data;
    return this;
  }

  upgradeState(new_state, new_timestamp) {
    // updates state and timestamp ONLY if the new state is a later state (so, we cant go back from confirmed to included, for example)
    if (new_state >= this.state) {
      this.state = new_state;
      this.timestamp = new_timestamp;
    }
    // else ignore downgrade attempts, not an error

    return this;
  }

  fromDataArray(data, fromFCM = true) {
    this.tokenData = {};

    if (data.length > 8) {
      // we have token data.
      if (fromFCM)
        Object.entries(data[8]).forEach(([token, ops]) =>
          Object.entries(ops).forEach(([op, opdata]) =>
            opdata.forEach((opdata) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x) => dropHexPrefix(x))
              )
            )
          )
        );
      else {
        Object.entries(data[8]).forEach(([token, ops]) =>
          ops.forEach((opdescr) =>
            Object.entries(opdescr).forEach(([op, opdata]) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x) => dropHexPrefix(x))
              )
            )
          )
        );
      }
    }

    if (data.length > 10) this.data = data[10];

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
    else this.tokenData[token] = [new TxTokenOpNameToClass[operation](data)];

    return this;
  }

  hasTokenOperations(token) {
    return this.tokenData.hasOwnProperty(token);
  }

  hasTokenOperation(token, operation) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return false;

    const cls = TxTokenOpNameToClass[operation];
    return this.tokenData[token].some((x) => x instanceof cls);
  }

  getTokenOperations(token, operation) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return [];
    const cls = operation ? TxTokenOpNameToClass[operation] : null;
    return this.tokenData[token].filter(
      (x) => operation == null || x instanceof cls
    );
  }

  getAllTokenOperations() {
    return this.tokenData;
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

  getApplication(to) {
    const UniswapV1 = '0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667';
    const UniswapV2 = '0xf164fc0ec4e93095b804a4795bbe1e041497b92a';
    if (to) {
      switch (to.toLowerCase()) {
        case GlobalConfig.cDAIcontract.toLowerCase():
          return 'Compound';
        case UniswapV1:
        case UniswapV2:
        case GlobalConfig.RouterUniswapV2.toLowerCase():
          return 'Uniswap';
        case GlobalConfig.DAIPoolTogetherContractV2.toLowerCase():
          return 'PoolTogether';
        default:
          return '';
      }
    } else {
      return '';
    }
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

  getGasPrice() {
    return this.gasPrice;
  }

  getGasLimit() {
    return this.gas;
  }

  toTransactionDict() {
    return {
      nonce: `0x${this.nonce.toString(16)}`,
      to: this.getTo(),
      gasPrice: `0x${this.gasPrice}`,
      gasLimit: `0x${this.gas}`,
      value: `0x${this.getValue()}`,
      chainId: GlobalConfig.network_id,
      data: this.data.data
    };
  }

  toJSON() {
    return [
      this.getFrom(),
      this.getTo(),
      this.gas,
      this.gasPrice,
      this.value,
      this.nonce,
      this.timestamp,
      this.state,
      this.tokenData,
      this.data
    ];
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
    ntx.data = Object.assign({}, ntx.data); // expected to be a simple key => value map, so a shallow clone of this should be sufficient for now.

    for (let n of Object.getOwnPropertyNames(ntx.tokenData))
      ntx.tokenData[n] = ntx.tokenData[n].map((x) => x.deepClone());

    return ntx;
  }

  freeze() {
    for (let n of Object.getOwnPropertyNames(this.tokenData)) {
      this.tokenData[n].forEach((x) => x.freeze());
      Object.freeze(this.tokenData[n]);
    }
    Object.freeze(this.data);
    Object.freeze(this.tokenData);
    Object.freeze(this);

    return this;
  }
}

// function arraySortUnique(x, sortfunc) {
//   // modifies input array
//   x.sort(sortfunc);

//   for (let lastElement, i = x.length - 1; i >= 0; i--) {
//     if (x[i] === lastElement) x.splice(i, 1);
//     else lastElement = x[i];
//   }

//   return x;
// }

// ========== storage class for all transactions ==========
// this is the one we instantiate (once) to use the TX data in storage.
// import React, { Component } from 'react'; - not needed without the wrapper.
const maxNonceKey = '_tx[maxnonce]';
const txNoncePrefix = 'nonce_';
const txFailPrefix = 'fail_';
const txStatePrefix = 'state_';
const lastCheckpointKey = '_txsync[checkpoint]';

class TxStorage {
  constructor(ourAddress) {
    let load_promises = [];
    let promise_resolves = [];
    let promise_rejects = []; // if i ever implement this

    [0, 1].forEach(() => {
      load_promises.push(
        new Promise((res, rej) => {
          promise_resolves.push(res);
          promise_rejects.push(rej);
        })
      );
    });

    this.onload_promise = Promise.all(load_promises);

    LogUtilities.toDebugScreen('TxStorage constructor called');
    this.our_max_nonce = -1; // for our txes
    this.failed_nonces = null;
    this.last_checkpoint_offset = 0; // TODO: not yet used

    AsyncStorage.multiGet([maxNonceKey, lastCheckpointKey]).then((x) => {
      if (x[0] && x[0][1] !== null) this.our_max_nonce = parseInt(x[0][1]);
      if (x[1] && x[1][1] !== null)
        this.last_checkpoint_offset = parseInt(x[1][1]);

      promise_resolves[1]();
      LogUtilities.toDebugScreen(
        `MaxNonce: ${this.our_max_nonce}, LastCheckpointOffset: ${this.last_checkpoint_offset}`
      );
    });

    this.txes = new PersistTxStorageAbstraction('tx_');

    this.txes.init_storage(
      {
        dai: this.txfilter_isRelevantToDai, // doesn't use this, no need for .bind(this)
        odcda: this.txfilter_ourDAIForCDAIApprovals.bind(this),
        odpta: this.txfilter_ourDAIForPTApprovals.bind(this)
      },
      (x) => {
        this.failed_nonces = x;
        promise_resolves[0]();
      }
    );

    if (ourAddress) this.our_address = hexToBuf(ourAddress);
    else this.our_address = null;

    this.on_update = [];

    // AsyncStorage.getAllKeys().then(x => {
    // 	LogUtilities.toDebugScreen(`AStor keys: ${x}`);
    // });

    // this has sensitive data, so let's not:
    // AsyncStorage.getItem('persist:root').then(x => {
    //  	LogUtilities.toDebugScreen(`persist:root: ${x}`);
    // });

    this.locks = new asyncLocks();

    this.temporary_since_you_wont_add_build_number_i_will = 1;
  }

  async __lock(name) {
    LogUtilities.toDebugScreen(`TxStorage attempt __lock(${name})`);
    const t = Date.now();
    await this.locks.lock(name);
    LogUtilities.toDebugScreen(
      `TxStorage __lock(${name}) succeeded, wait time:${Date.now() - t}ms`
    );
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
    return () => {
      this.unsubscribe(func);
    };
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
    if (this.our_address) return this.our_address.toString('hex');

    return null;
  }

  async newTx(state = TxStates.STATE_NEW, nonce) {
    const now = Math.trunc(Date.now() / 1000);
    let tx = new Tx(state)
      .setTimestamp(now)
      .setNonce(nonce ? nonce : await this.getNextNonce());

    tx.from_addr = this.our_address;

    return tx;
  }

  __onUpdate(oldTx, newTx) {
    LogUtilities.toDebugScreen('TxStorage __onUpdate() called');
    try {
      this.on_update.forEach((x) => x(oldTx, newTx));
    } catch (e) {
      LogUtilities.toDebugScreen(
        `__executeUpdateCallbacks exception: ${e.message} @ ${e.stack}`
      );
    }
    return this;
  }

  async getTx(id, index = 'all') {
    return await this.txes.getTxByNum(id, index);
  }

  getTxCount(index = 'all') {
    return this.txes.getItemCount(index);
  }

  txfilter_checkMaxNonce(tx) {
    // not a real filter, but updates our max nonce.
    if (
      tx.from_addr &&
      tx.nonce > this.our_max_nonce &&
      this.our_address.equals(tx.from_addr)
    ) {
      this.our_max_nonce = tx.nonce;
      return true;
    }

    return false;
  }

  txfilter_isRelevantToDai(tx) {
    return (
      tx.hasTokenOperations('dai') ||
      (tx.hasTokenOperations('cdai') &&
        (tx.hasTokenOperation('cdai', TxTokenOpTypeToName.mint) ||
          tx.hasTokenOperation('cdai', TxTokenOpTypeToName.redeem) ||
          tx.hasTokenOperation('cdai', TxTokenOpTypeToName.failure))) ||
      (tx.hasTokenOperations('uniswap') &&
        tx.hasTokenOperation('uniswap', TxTokenOpTypeToName.eth2tok)) ||
      tx.hasTokenOperation('uniswap', TxTokenOpTypeToName.tok2eth) ||
      (tx.hasTokenOperations('uniswap2ethdai') &&
        tx.hasTokenOperation('uniswap2ethdai', TxTokenOpTypeToName.U2swap)) ||
      (tx.hasTokenOperations('pooltogether') &&
        (tx.hasTokenOperation(
          'pooltogether',
          TxTokenOpTypeToName.PTdeposited
        ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTdepositedAndCommitted
          ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTsponsorshipDeposited
          ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTwithdrawn
          ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTopenDepositWithdrawn
          ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn
          ) ||
          tx.hasTokenOperation(
            'pooltogether',
            TxTokenOpTypeToName.PTcommittedDepositWithdrawn
          ) ||
          tx.hasTokenOperation('pooltogether', TxTokenOpTypeToName.PTrewarded)))
    );

    // return false;
  }

  txfilter_ourDAIForCDAIApprovals(tx) {
    const our_hex_address = this.our_address.toString('hex');
    const cdai_address = GlobalConfig.cDAIcontract.startsWith('0x')
      ? GlobalConfig.cDAIcontract.substr(2).toLowerCase()
      : GlobalConfig.cDAIcontract.toLowerCase();
    return tx
      .getTokenOperations('dai', TxTokenOpTypeToName.approval)
      .some((x) => x.spender == cdai_address && x.approver == our_hex_address);
  }

  txfilter_ourDAIForPTApprovals(tx) {
    const our_hex_address = this.our_address.toString('hex');
    const pooltogether_address = GlobalConfig.DAIPoolTogetherContractV2.startsWith(
      '0x'
    )
      ? GlobalConfig.DAIPoolTogetherContractV2.substr(2).toLowerCase()
      : GlobalConfig.DAIPoolTogetherContractV2.toLowerCase();
    return tx
      .getTokenOperations('dai', TxTokenOpTypeToName.approval)
      .some(
        (x) =>
          x.spender == pooltogether_address && x.approver == our_hex_address
      );
  }

  async saveTx(tx) {
    // used now only to save our own sent txes, therefore those wont have anything but the nonce.
    await this.__lock('txes');
    const nonceKey = `${txNoncePrefix}${tx.getNonce()}`;
    await this.txes.appendTx(nonceKey, tx, true);
    LogUtilities.toDebugScreen(`saveTx(): tx saved (key:${nonceKey}): `, tx);
    if (this.txfilter_checkMaxNonce(tx)) {
      await AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
      LogUtilities.toDebugScreen(
        `saveTx(): our_max_nonce changed to ${this.our_max_nonce}`
      );
    }

    if (this.failed_nonces.hasOwnProperty(tx.getNonce()))
      delete this.failed_nonces[tx.getNonce()];

    this.__unlock('txes');
    this.__onUpdate(null, tx);
  }

  async updateTx(tx) {
    // done when resending
    await this.__lock('txes');
    const nonceKey = `${txNoncePrefix}${tx.getNonce()}`;
    const oldTx = await this.txes.updateTxDataIfExists(nonceKey, tx);
    LogUtilities.toDebugScreen(
      `updateTx(): tx ${oldTx ? 'updated' : 'NOT updated'} (key:${nonceKey}): `,
      tx
    );
    this.__unlock('txes');
    if (oldTx) this.__onUpdate(oldTx, tx); // TODO: should we actually call that? we're replacing a tx manually, we kinda know it was changed. well if the outside code is smart enough to know that and wont just trigger stuff "because something changed", then ok.
    return oldTx;
  }

  async parseTxHistory(histObj) {
    LogUtilities.toDebugScreen('TxStorage parseTxHistory() called');
    if (histObj['_contracts']) delete histObj['_contracts'];

    histObj = Object.entries(histObj).map(([hash, data]) =>
      new Tx(data[7]).setHash(hash).fromDataArray(data)
    );
    await this.__lock('txes');
    histObj.forEach((tx) => this.txfilter_checkMaxNonce(tx));
    histObj.sort((a, b) => {
      const diff = a.getTimestamp() - b.getTimestamp();
      return diff != 0 ? diff : a.getHash().localeCompare(b.getHash());
    });
    await this.txes.bulkLoad(histObj);

    AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
    LogUtilities.toDebugScreen(
      `parseTxHistory(): our_max_nonce changed to ${this.our_max_nonce}`
    );
    this.failed_nonces = {};

    this.__unlock('txes');
    this.__onUpdate();
  }

  async processTxState(hash, data) {
    LogUtilities.toDebugScreen(`processTxState(hash:${hash}) + `, data);

    await this.__lock('txes');

    let tx = await this.txes.getTxByHash(hash);
    if (tx) {
      // sounds like state update.
      LogUtilities.toDebugScreen(
        `processTxState(hash:${hash}) known included+ tx: `,
        tx
      );

      let newtx = tx.deepClone();
      // LogUtilities.toDebugScreen(`processTxState(hash:${hash}) deep clone: `, JSON.stringify(newtx));

      if (data[0] != null)
        // or maybe more ;-) <- careful here, if this causes different filters to match then we're borked.
        newtx.fromDataArray(data);
      else newtx.upgradeState(data[7], data[6]);

      LogUtilities.toDebugScreen(
        `processTxState(hash: ${hash}) known included+ tx updated: `,
        newtx
      );

      await this.txes.updateTx(tx, newtx, hash);

      this.__unlock('txes');
      this._isDAIApprovedForCDAI_cached = undefined;
      this._isDAIApprovedForPT_cached = undefined;
      this.__onUpdate(tx, newtx);
      return;
    }

    // from here on we know it's not a tx we saved by hash

    if (data[0] !== null) {
      // we have the data, nice
      const ourTx = this.our_address.equals(Buffer.from(data[0], 'hex'));
      let savedState = await AsyncStorage.getItem(`tx_${txStatePrefix}${hash}`);
      if (savedState) {
        await AsyncStorage.removeItem(`tx_${txStatePrefix}${hash}`);
        LogUtilities.toDebugScreen(
          `processTxState(hash:${hash}) savedState present: `,
          savedState
        );
        savedState = JSON.parse(savedState);
      }

      if (ourTx) {
        // our tx so find by nonce
        const nonce = typeof data[5] === 'string' ? parseInt(data[5]) : data[5];
        const nonceKey = `${txNoncePrefix}${nonce}`;

        if (nonce > this.our_max_nonce) {
          this.our_max_nonce = nonce;
          await AsyncStorage.setItem(
            maxNonceKey,
            this.our_max_nonce.toString()
          );
          LogUtilities.toDebugScreen(
            `processTxState(): our_max_nonce changed to ${this.our_max_nonce}`
          );

          this.failed_nonces = {}; // since it's a nonce higher than all our known nonces, clearly everything below went through
        }

        tx = await this.txes.getTxByHash(nonceKey);
        if (tx) {
          LogUtilities.toDebugScreen(
            `processTxState(hash:${hash}) known OUR tx by nonce: `,
            tx
          );

          if (this.failed_nonces.hasOwnProperty(nonce))
            delete this.failed_nonces[nonce];

          let newtx = tx.deepClone();
          // LogUtilities.toDebugScreen(`processTxState(hash:${hash}) deep clone: `, JSON.stringify(newtx));
          newtx.setHash(hash).fromDataArray(data).tempDropData();

          if (savedState) newtx.upgradeState(savedState[7], savedState[6]);

          // update to normal tx (with hash), rename keys, etc.
          await this.txes.replaceTx(tx, newtx, nonceKey, hash, true);

          LogUtilities.toDebugScreen(
            `processTxState(hash:${hash}) known OUR tx, promoted: `,
            newtx
          );

          this.__unlock('txes');
          this._isDAIApprovedForCDAI_cached = undefined;
          this._isDAIApprovedForPT_cached = undefined;
          this.__onUpdate(tx, newtx);
          return;
        }
      }

      // it's a new, not known tx, and we've got the data. just append... and check if it wasn't confirmed yet (savedState)
      tx = new Tx(data[7]).setHash(hash).fromDataArray(data);

      // if (savedState) also update state to that, if higher.
      if (savedState) tx.upgradeState(savedState[7], savedState[6]);

      LogUtilities.toDebugScreen(
        `processTxState(hash:${hash}) not known ${
          ourTx ? 'OUR ' : ''
        }tx, saving: `,
        tx
      );

      await this.txes.appendTx(hash, tx, false);

      this.__unlock('txes');
      this._isDAIApprovedForCDAI_cached = undefined;
      this._isDAIApprovedForPT_cached = undefined;
      this.__onUpdate(null, tx);
      return;
    }

    // so we have no data, and it's not a known tx. just remember the state.
    // TODO: load savedState (previous tx_state_${hash}), in case this is just an upgrade. not really possible now, but to make it nice it should be done.
    tx = new Tx(data[7]).setHash(hash).setTimestamp(data[6]);

    await AsyncStorage.setItem(
      `tx_${txStatePrefix}${hash}`,
      JSON.stringify(tx)
    );
    LogUtilities.toDebugScreen(
      `processTxState(hash: ${hash}) not known tx WITH NO DATA (OOPS...), state saved: `,
      tx
    );
    this.__unlock('txes');
    // no onupdate here as we did not save that Tx, umm, in the pool... yet.
  }

  async markNotIncludedTxAsErrorByNonce(nonce) {
    LogUtilities.toDebugScreen(
      `markNotIncludedTxAsErrorByNonce(nonce:${nonce})`
    );
    await this.__lock('txes');
    const nonceKey = `${txNoncePrefix}${nonce}`;

    let tx = await this.txes.getTxByHash(nonceKey);
    if (tx) {
      this.failed_nonces[nonce] = true;

      let newtx = tx.deepClone();
      newtx.setState(TxStates.STATE_GETH_ERROR);

      await this.txes.replaceTx(
        tx,
        newtx,
        nonceKey,
        `${txFailPrefix}${nonce}_${this.txes.getItemCount('all')}`,
        true
      );

      this.__unlock('txes');
      LogUtilities.toDebugScreen(
        `markNotIncludedTxAsErrorByNonce(nonce:${nonce}) state updated`
      );
      this.__onUpdate();
    } else {
      this.__unlock('txes');
      LogUtilities.toDebugScreen(
        `markNotIncludedTxAsErrorByNonce(nonce:${nonce}) key not found!`
      );
      throw new NoSuchTxException(
        `markNotIncludedTxAsErrorByNonce(): unknown tx nonce: ${nonce}`
      );
    }
  }

  async getNextNonce() {
    const failed_nonce = Object.keys(this.failed_nonces)
      .map((x) => parseInt(x))
      .reduce((a, b) => (a !== null ? (a > b ? b : a) : b), null);
    LogUtilities.toDebugScreen(
      `getNextNonce(): next nonce:${
        failed_nonce !== null ? failed_nonce : this.our_max_nonce + 1
      } our_max_nonce:${
        this.our_max_nonce
      }, failed_nonce:${failed_nonce} failed_nonces:${JSON.stringify(
        this.failed_nonces
      )}`
    );

    return failed_nonce !== null ? failed_nonce : this.our_max_nonce + 1;
  }

  async clear(batch = false) {
    await this.__lock('txes');
    let tasks = [AsyncStorage.setItem(maxNonceKey, '-1'), this.txes.wipe()];
    await Promise.all(tasks);

    // after this.txes.wipe() ends, we may wanna iterate all the keys and remove rogue tx_state_...

    this.our_max_nonce = -1;
    this.failed_nonces = {};

    this.__unlock('txes');

    if (!batch) this.__onUpdate();

    this._isDAIApprovedForCDAI_cached = undefined;
    this._isDAIApprovedForPT_cached = undefined;

    return this;
  }

  async isDAIApprovedForCDAI() {
    // TODO: i dont think this should be here, really. this is not a storage function...
    if (!this._isDAIApprovedForCDAI_cached) {
      const last_odcda_tx = await this.txes.getLastTx('odcda');
      this._isDAIApprovedForCDAI_cached =
        !!last_odcda_tx &&
        last_odcda_tx
          .getTokenOperations('dai', TxTokenOpTypeToName.approval)
          .some(
            (x) =>
              x.amount ===
              'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          );
    }

    return this._isDAIApprovedForCDAI_cached;
  }

  async isDAIApprovedForPT() {
    // TODO: this function should not be here
    if (!this._isDAIApprovedForPT_cached) {
      const last_odpta_tx = await this.txes.getLastTx('odpta');
      this._isDAIApprovedForPT_cached =
        !!last_odpta_tx &&
        last_odpta_tx
          .getTokenOperations('dai', TxTokenOpTypeToName.approval)
          .some(
            (x) =>
              x.amount ==
              'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          );
    }

    return this._isDAIApprovedForPT_cached;
  }

  async getVerificationData() {
    return await this.getVerificationDataXOR();
  }

  getCheckpoints(count, offset) {
    const hashes = Math.floor(4000 / 33);
    const computed_count = count - offset;
    const buckets = [];

    if (hashes >= computed_count) {
      for (let i = offset + 1; i <= count; ++i) buckets.push(i);

      return buckets;
    }

    let last = offset + 1;
    for (let i = 1; i < hashes; ++i) {
      last = Math.floor(Math.log(i) * computed_count);
      buckets.push(last);
    }

    const mult = computed_count / last;
    last = count + 1;
    for (let i = buckets.length - 1; i > 0; --i) {
      buckets[i] = offset + Math.floor(buckets[i] * mult);
      if (buckets[i] >= last) buckets[i] = last - 1;

      last = buckets[i];
    }

    buckets[0] = offset + 1;

    return buckets;
  }

  async getVerificationDataXOR() {
    // TODO: this also counts sent txes and failures. we probably should ignore those. we may need to store the count of failures for the `all' index. we should already have the count of sent (toplocks)
    // TODO: we need to store [last_number_checked(offset), last_hash], so when we get hashes from given offset, we just xor them against last_hash and continue normally.

    await this.__lock('txes');
    const offset = 0;

    //const hashes = await this.txes.getHashes('all', offset);
    const hashes = (await this.txes.getHashes('all', offset)).filter(
      ([x]) => !x.startsWith(txNoncePrefix) && !x.startsWith(txFailPrefix)
    );
    const checkpoints = this.getCheckpoints(hashes.length, offset);
    const ret = [];

    let lasthash = null;
    let checkpoint = 0;
    hashes.forEach(([h, d], idx) => {
      const cb = crypto.createHash('md5').update(`${h}|${d}`).digest(); // we md5-hash those hashes so that: a) they're shorter, b) we can add more data to checksums easily, without making the xored values longer
      // const cb = Buffer.from(h, 'hex');
      if (lasthash) {
        for (let i = lasthash.length - 1; i >= 0; --i)
          lasthash[i] = lasthash[i] ^ cb[i];
      } else lasthash = cb;

      // LogUtilities.toDebugScreen(`XOR ${idx+1}: [${h}]  ${lasthash.toString('hex')}`);

      if (checkpoints[checkpoint] === idx + 1) {
        ret.push(lasthash.toString('hex'));
        ++checkpoint;
      }
    });

    await this.__unlock('txes');

    return {
      hashes: ret,
      count: hashes.length,
      offset: offset,
      checkpoints: checkpoints
    };
  }

  async processTxSync(data) {
    // LogUtilities.toDebugScreen('processTxSync(): received txsync data:', data);
    if ('_contracts' in data)
      // TODO: we really should use it at one point
      delete data['_contracts'];

    data = Object.entries(data).map(([hash, txdata]) =>
      new Tx(txdata[7]).setHash(hash).fromDataArray(txdata)
    );
    data.sort((a, b) => {
      const diff = a.getTimestamp() - b.getTimestamp();
      return diff != 0 ? diff : a.getHash().localeCompare(b.getHash());
    });

    // LogUtilities.toDebugScreen('processTxSync(): txsync data:', data);

    await this.__lock('txes');

    const removeKeys = [];

    let changed = 0;
    let newNonce = this.our_max_nonce;

    for (let i = 0; i < data.length; ++i) {
      const tx = data[i];
      let oldTx;
      const ourTx = tx.from_addr && this.our_address.equals(tx.from_addr);
      removeKeys.push(`tx_${txStatePrefix}${tx.getHash()}`);

      if (ourTx) {
        if (tx.getNonce() > newNonce) newNonce = tx.getNonce();

        const nonceKey = `${txNoncePrefix}${tx.getNonce()}`;
        oldTx = await this.txes.getTxByHash(nonceKey);
        if (oldTx) {
          // replacetx
          LogUtilities.toDebugScreen(
            'processTxSync(): found OUR tx by nonce: ',
            oldTx
          );
          LogUtilities.toDebugScreen(
            'processTxSync(): to be replaced with: ',
            tx
          );
          await this.txes.replaceTx(oldTx, tx, nonceKey, tx.getHash(), true); // since we're replacing with server data, there is no 'input' field already, no need to drop anything.
          changed++;

          continue;
        }
      }

      oldTx = await this.txes.getTxByHash(tx.getHash());

      if (oldTx) {
        // updateTx, perhaps after comparing if changed
        LogUtilities.toDebugScreen(
          'processTxSync(): found tx by hash: ',
          oldTx
        );
        if (oldTx.getState() !== tx.getState()) {
          LogUtilities.toDebugScreen(
            'processTxSync(): to be replaced with: ',
            tx
          );
          await this.txes.updateTx(oldTx, tx, tx.getHash());
          // await this.txes.replaceTx(oldTx, tx, tx.getHash(), tx.getHash(), false);
          changed++;
        } else
          LogUtilities.toDebugScreen(
            'processTxSync(): replacement has same state, skipping: ',
            tx
          );

        continue;
      }

      LogUtilities.toDebugScreen(
        'processTxSync(): inserting new, unknown tx: ',
        tx
      );

      await this.txes.appendTx(tx.getHash(), tx, false);
      changed++;
    }
    LogUtilities.toDebugScreen(
      `processTxSync(): removeKeys: ${removeKeys.join()}`
    );
    await AsyncStorage.multiRemove(removeKeys);

    if (newNonce != this.our_max_nonce) {
      this.failed_nonces = {};
      this.our_max_nonce = newNonce;
      await AsyncStorage.setItem(maxNonceKey, this.our_max_nonce.toString());
      LogUtilities.toDebugScreen(
        `processTxSync(): our_max_nonce changed to ${this.our_max_nonce}`
      );
    }

    this.__unlock('txes');

    if (changed > 0) this.__onUpdate();
  }

  async debugDumpAllTxes(index = 'all') {
    return await this.txes.debugDumpAllTxes(index);
  }
}

module.exports = {
  Tx: Tx,
  // TxStorage: TxStorage, // nope, one instance to rule them all, let's not allow people to instantiate this.
  TxStates: TxStates,
  TxTokenOpTypeToName: TxTokenOpTypeToName,
  TxTokenOpNameToClass: TxTokenOpNameToClass,

  TxException: TxException,
  NoSuchTxException: NoSuchTxException,
  DuplicateNonceTxException: DuplicateNonceTxException,
  DuplicateHashTxException: DuplicateHashTxException,
  //InvalidStateTxException: InvalidStateTxException,

  storage: new TxStorage()
};
