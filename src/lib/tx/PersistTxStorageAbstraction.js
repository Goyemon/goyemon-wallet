import AsyncStorage from "@react-native-community/async-storage";
import LogUtilities from "../../utilities/LogUtilities";
import Tx from "./Tx";
import { txNoncePrefix, txFailPrefix, storage_bucket_size } from "./common";

export default class PersistTxStorageAbstraction {
  constructor(prefix = "") {
    LogUtilities.toDebugScreen(
      "PersistTxStorageAbstraction constructor called"
    );

    this.cache = {};
    this.counts = {};
    this.filters = {};
    this.toplocked_per_filter = {};
    this.locks = {};

    this.prefix = prefix; // `${this.prefix}${key}`

    this.debug = true;
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
      if (typeof buck !== "string") return JSON.stringify(buck);

      let itemlens = {};
      let cnt = 0;
      buck.split(",").forEach((x) => {
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
              parseInt(x[i].slice(txFailPrefix.length, x[i].indexOf("_") - 1))
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

    load_index_data("all");

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
    return b.split(",");
  }
  __encodeBucket(ba) {
    return ba.join(",");
  }
  __decodeTx(hash, data) {
    if (!data) return null;

    data = JSON.parse(data);

    return new Tx(data[7]).setHash(hash).fromDataArray(data, false);
  }

  async getTxByNum(num, index = "all") {
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

  async getLastTx(index = "all") {
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

  async getHashes(index = "all", offset = 0) {
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
    let append_indices = ["all"];
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
                        i == bucket_num ? ` splice_position:${bucket_pos}` : ""
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
      add_to_index("all", hash);

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

  getItemCount(index = "all") {
    return this.counts[index];
  }

  async __replaceKeyInIndex(
    oldkey,
    newkey,
    index = "all",
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

  async removeKey(oldkey, index = "all") {
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
      [this.__replaceKeyInIndex(oldhash, newhash, "all", toplockremove)].concat(
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

  async debugDumpAllTxes(index = "all") {
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
