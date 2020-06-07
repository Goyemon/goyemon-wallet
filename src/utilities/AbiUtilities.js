'use strict';
import web3 from 'web3';
// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html
// https://github.com/indutny/bn.js/blob/master/lib/bn.js

class RuDataBuilder {
  constructor(method, fields, decimalat = -1) {
    this.decimal_places = decimalat >= 0 ? decimalat : 18;
    this.multiplier = new web3.utils.BN(10).pow(
      new web3.utils.BN(this.decimal_places)
    );
    this.current_offset = 4;
    this.buf = Buffer.allocUnsafe(4 + fields * 32);
    Buffer.from(method).copy(this.buf);
  }

  putAddress(addr) {
    this.__addrToBuf(addr).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putAddressArray(addrs) {
    this.__numToUint256(addrs.length, false).copy(this.buf, this.current_offset);
    this.current_offset += 32;
    for (let i = 0; i < addrs.length; i ++) {
      this.__addrToBuf(addrs[i]).copy(this.buf, this.current_offset);
      this.current_offset += 32;
    }

    return this;
  }

  putUint256Scaled(val) {
    this.__numToUint256(val, true).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putUint256Unscaled(val) {
    this.__numToUint256(val, false).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  putPrefix(val) {
    this.__numToUint256(val, false).copy(this.buf, this.current_offset);
    this.current_offset += 32;

    return this;
  }

  get() {
    return `0x${this.buf.toString('hex')}`;
  }

  __numToUint256(value, scaled = false) {
    let ret = Buffer.alloc(32);
    let val;
    if (scaled)
      val = web3.utils.toBN(value).mul(this.multiplier).toBuffer('be', 0);
    else val = web3.utils.toBN(value).toBuffer('be', 0);
    val.copy(ret, 32 - val.byteLength);

    return ret;
  }

  __addrToBuf(h) {
    let ret = Buffer.alloc(32);
    Buffer.from(h.substr(0, 2) == '0x' ? h.substr(2) : h, 'hex').copy(ret, 12);

    return ret;
  }
}

class ABIEncoder {
  static encodeTransfer(toAddr, value, decimals = 18) {
    return new RuDataBuilder([0xa9, 0x05, 0x9c, 0xbb], 2, decimals)
      .putAddress(toAddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeTransferFrom(fromaddr, toaddr, value, decimals = 18) {
    return new RuDataBuilder([0x23, 0xb8, 0x72, 0xdd], 3, decimals)
      .putAddress(fromaddr)
      .putAddress(toaddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeApprove(spenderAddr, value, decimals = 18) {
    return new RuDataBuilder([0x09, 0x5e, 0xa7, 0xb3], 2, decimals)
      .putAddress(spenderAddr)
      .putUint256Scaled(value)
      .get();
  }

  static encodeCDAIMint(amount, decimals = 18) {
    return new RuDataBuilder([0xa0, 0x71, 0x2d, 0x68], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeCDAIRedeemUnderlying(amount, decimals = 18) {
    return new RuDataBuilder([0x85, 0x2a, 0x12, 0xe3], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeEthToTokenSwapInput(minTokens, deadline, decimals = 18) {
    return new RuDataBuilder([0xf3, 0x39, 0xb5, 0x9b], 2, decimals)
      .putUint256Scaled(minTokens)
      .putUint256Unscaled(deadline)
      .get();
  }

  static encodeSwapExactETHForTokens(minTokens, path, recipient, deadline, decimals = 18) {
    let fields = 5 + path.length
    return new RuDataBuilder([0x7f, 0xf3, 0x6a, 0xb5], fields, decimals)
    .putUint256Scaled(minTokens)
    .putPrefix(128)
    .putAddress(recipient)
    .putUint256Unscaled(deadline)
    .putAddressArray(path)
    .get();
  }

  static encodeDepositPool(amount, decimals = 18) {
    return new RuDataBuilder([0x23, 0x44, 0x09, 0x44], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }

  static encodeWithdraw(amount, decimals = 18) {
    return new RuDataBuilder([0x2e, 0x1a, 0x7d, 0x4d], 1, decimals)
      .putUint256Scaled(amount)
      .get();
  }
}

export default ABIEncoder;
/*
const max = `0x${'ff'.repeat(256/8)}`;

console.log(ABIEncoder.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', max).toString('hex'));

console.log(ABIEncoder.encodeTransfer('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(ABIEncoder.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(ABIEncoder.encodeTransferFrom('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', '0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(ABIEncoder.encodeCDAIMint(1024).toString('hex'));
console.log(ABIEncoder.encodeCDAIRedeemUnderlying(1024).toString('hex'));
*/
