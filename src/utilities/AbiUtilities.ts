'use strict';
const web3 = require('web3');
// https://github.com/indutny/bn.js/blob/master/lib/bn.js

class RuDataBuilder {
  decimal_places: number;
  multiplier: any;
  current_offset: number;
  buf: Buffer;
  constructor(method: any, fields: any, decimalat = -1) {
    this.decimal_places = decimalat >= 0 ? decimalat : 18;
    this.multiplier = new web3.utils.BN(10).pow(
      new web3.utils.BN(this.decimal_places)
    );
    this.current_offset = 4;
    this.buf = Buffer.allocUnsafe(4 + fields * 32);
    Buffer.from(method).copy(this.buf);
  }

  putAddress(addr: string) {
    this.__addrToBuf(addr).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putAddressArray(addrs: string) {
    this.__numToUint256(addrs.length, false).copy(
      this.buf,
      this.current_offset
    );
    this.current_offset += 32;
    for (let i = 0; i < addrs.length; i++) {
      this.__addrToBuf(addrs[i]).copy(this.buf, this.current_offset);
      this.current_offset += 32;
    }

    return this;
  }

  putUint256Scaled(val: any) {
    this.__numToUint256(val, true).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putUint256Unscaled(val: any) {
    this.__numToUint256(val, false).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putPrefix(val: any) {
    this.__numToUint256(val, false).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  get() {
    return `0x${this.buf.toString('hex')}`;
  }

  __numToUint256(value: any, scaled = false) {
    let ret = Buffer.alloc(32);
    let val;
    if (scaled)
      val = web3.utils.toBN(value).mul(this.multiplier).toBuffer('be', 0);
    else val = web3.utils.toBN(value).toBuffer('be', 0);
    val.copy(ret, 32 - val.byteLength);

    return ret;
  }

  __addrToBuf(h: string) {
    let ret = Buffer.alloc(32);
    Buffer.from(h.substr(0, 2) == '0x' ? h.substr(2) : h, 'hex').copy(ret, 12);

    return ret;
  }
}

export default class ABIEncoder {
  static encodeTransfer(toAddr: any, value: any, decimals = 18) {
    return new RuDataBuilder([0xa9, 0x05, 0x9c, 0xbb], 2, decimals)
      .putAddress(toAddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeTransferFrom(
    fromaddr: any,
    toaddr: any,
    value: any,
    decimals = 18
  ) {
    return new RuDataBuilder([0x23, 0xb8, 0x72, 0xdd], 3, decimals)
      .putAddress(fromaddr)
      .putAddress(toaddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeApprove(spenderAddr: any, value: any, decimals = 18) {
    return new RuDataBuilder([0x09, 0x5e, 0xa7, 0xb3], 2, decimals)
      .putAddress(spenderAddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeCDAIMint(amount: any, decimals = 18) {
    return new RuDataBuilder([0xa0, 0x71, 0x2d, 0x68], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeCDAIRedeemUnderlying(amount: any, decimals = 18) {
    return new RuDataBuilder([0x85, 0x2a, 0x12, 0xe3], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeSwapExactETHForTokens(
    minTokens: any,
    path: any,
    recipient: any,
    deadline: any,
    decimals = 18
  ) {
    let fields = 5 + path.length;
    return new RuDataBuilder([0x7f, 0xf3, 0x6a, 0xb5], fields, decimals)
      .putUint256Scaled(minTokens)
      .putPrefix(128)
      .putAddress(recipient)
      .putUint256Unscaled(deadline)
      .putAddressArray(path)
      .get();
  }

  static encodeDepositPool(amount: any, decimals = 18) {
    return new RuDataBuilder([0x23, 0x44, 0x09, 0x44], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeWithdraw(amount: any, decimals = 18) {
    return new RuDataBuilder([0x2e, 0x1a, 0x7d, 0x4d], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }
}
