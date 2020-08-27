import crypto from 'crypto';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalConfig from '../../config.json';
import LogUtilities from '../../utilities/LogUtilities';
import PersistTxStorageAbstraction from './PersistTxStorageAbstraction';
import AsyncLocks from './AsyncLocks';
import Tx from './Tx';
import { TxTokenOpTypeToName } from './TokenOpType';
import TxStates from './TxStates';
import { NoSuchTxException } from './TxException';
import { hexToBuf } from './common';
import {
  maxNonceKey,
  txNoncePrefix,
  txFailPrefix,
  txStatePrefix,
  lastCheckpointKey
} from './common';

export default class TxStorage {
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

    this.locks = new AsyncLocks();

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
