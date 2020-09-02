import { TxTokenOpNameToClass } from './TokenOpType';
import { hexToBuf, dropHexPrefix } from './common';
const GlobalConfig = require('../../config.json');

export default class Tx {
  from_addr: any
  to_addr: any
  value: any
  gas: any
  gasPrice: any
  timestamp: any
  nonce: any
  hash: any
  state: any
  tokenData: any
  data: any
  constructor(state: any) {
    this.from_addr = this.to_addr = this.value = this.gas = this.gasPrice = this.timestamp = this.nonce = this.hash = null;
    this.state = state !== undefined ? state : null;
    this.tokenData = {};
    this.data = {}; // for additional items, such as transaction input field
  }

  setFrom(addr: any) {
    this.from_addr = hexToBuf(addr);
    return this;
  }

  setTo(addr: any) {
    this.to_addr = hexToBuf(addr);
    return this;
  }

  setHash(hash: any) {
    //this.hash = hexToBuf(hash);
    this.hash = hash;
    return this;
  }

  setNonce(nonce: any) {
    this.nonce = nonce;
    return this;
  }

  setValue(value: any) {
    this.value = value;
    return this;
  }

  setGas(value: any) {
    this.gas = value;
    return this;
  }

  setGasPrice(value: any) {
    this.gasPrice = value;
    return this;
  }

  setTimestamp(tstamp: any) {
    this.timestamp = tstamp;
    return this;
  }

  setState(state: any) {
    this.state = state;
    return this;
  }

  tempSetData(data: any) {
    // misleading now; means transaction input field
    this.data.data = data;
    return this;
  }

  tempDropData() {
    delete this.data.data;
    return this;
  }

  upgradeState(new_state: any, new_timestamp: any) {
    // updates state and timestamp ONLY if the new state is a later state (so, we cant go back from confirmed to included, for example)
    if (new_state >= this.state) {
      this.state = new_state;
      this.timestamp = new_timestamp;
    }
    // else ignore downgrade attempts, not an error

    return this;
  }

  fromDataArray(data: any, fromFCM = true) {
    this.tokenData = {};

    if (data.length > 8) {
      // we have token data.
      if (fromFCM)
        Object.entries(data[8]).forEach(([token, ops]: any) =>
          Object.entries(ops).forEach(([op, opdata]: any) =>
            opdata.forEach((opdata: any) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x: any) => dropHexPrefix(x))
              )
            )
          )
        );
      else {
        Object.entries(data[8]).forEach(([token, ops]: any) =>
          ops.forEach((opdescr: any) =>
            Object.entries(opdescr).forEach(([op, opdata]: any) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x: any) => dropHexPrefix(x))
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

  addTokenOperation(token: any, operation: any, data: any) {
    if (this.tokenData.hasOwnProperty(token))
      this.tokenData[token].push(new TxTokenOpNameToClass[operation](data));
    else this.tokenData[token] = [new TxTokenOpNameToClass[operation](data)];

    return this;
  }

  hasTokenOperations(token: any) {
    return this.tokenData.hasOwnProperty(token);
  }

  hasTokenOperation(token: any, operation: any) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return false;

    const cls = TxTokenOpNameToClass[operation];
    return this.tokenData[token].some((x: any) => x instanceof cls);
  }

  getTokenOperations(token: any, operation: any) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return [];
    const cls = operation ? TxTokenOpNameToClass[operation] : null;
    return this.tokenData[token].filter(
      (x: any) => operation == null || x instanceof cls
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
      ntx.tokenData[n] = ntx.tokenData[n].map((x: any) => x.deepClone());

    return ntx;
  }

  freeze() {
    for (let n of Object.getOwnPropertyNames(this.tokenData)) {
      this.tokenData[n].forEach((x: any) => x.freeze());
      Object.freeze(this.tokenData[n]);
    }
    Object.freeze(this.data);
    Object.freeze(this.tokenData);
    Object.freeze(this);

    return this;
  }
}
