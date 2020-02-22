'use strict';
const web3 = require('web3');
// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html
// https://github.com/indutny/bn.js/blob/master/lib/bn.js

class RuERC20Encoder {

	constructor(decimalat=-1) {
		this.decimal_places = decimalat >= 0 ? decimalat : 18;
		this.multiplier = new web3.utils.BN(10).pow(new web3.utils.BN(this.decimal_places));
		// buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
	}

	encodeTransfer(toAddr, value) {
		let ret = Buffer.allocUnsafe(4 + 32 + 32);
		Buffer.from([0xa9, 0x05, 0x9c, 0xbb]).copy(ret);
		this.__addrToBuf(toAddr).copy(ret, 4);
		this.__numToUint256Scaled(value).copy(ret, 4 + 32);

		return ret;
	}

	encodeTransferFrom(fromaddr, toaddr, value) {
		let ret = Buffer.allocUnsafe(4 + 32 + 32 + 32);
		Buffer.from([0x23, 0xb8, 0x72, 0xdd]).copy(ret);
		this.__addrToBuf(fromaddr).copy(ret, 4);
		this.__addrToBuf(toaddr).copy(ret, 4 + 32);
		this.__numToUint256Scaled(value).copy(ret, 4 + 32 + 32);

		return ret;
	}

	encodeApprove(spenderAddr, value) {
		let ret = Buffer.allocUnsafe(4 + 32 + 32);
		Buffer.from([0x09, 0x5e, 0xa7, 0xb3]).copy(ret);
		this.__addrToBuf(spenderAddr).copy(ret, 4);
		this.__numToUint256Scaled(value).copy(ret, 4 + 32);

		return ret;
	}

	encodeCDAIMint(amount) {
		let ret = Buffer.allocUnsafe(4 + 32);
		Buffer.from([0xa0, 0x71, 0x2d, 0x68]).copy(ret);
		this.__numToUint256Scaled(amount).copy(ret, 4);

		return ret;
	}

	encodeCDAIRedeemUnderlying(amount) {
		let ret = Buffer.allocUnsafe(4 + 32);
		Buffer.from([0x85, 0x2a, 0x12, 0xe3]).copy(ret);
		this.__numToUint256Scaled(amount).copy(ret, 4);

		return ret;
	}

	__numToUint256Scaled(value) {
		let ret = Buffer.alloc(32);
		let val = new web3.utils.BN(value).mul(this.multiplier).toBuffer('le', 0);
		val.copy(ret, 32 - val.byteLength);

		return ret;
	}

	__addrToBuf(h) {
		let ret = Buffer.alloc(32);
		Buffer.from((h.substr(0, 2) == '0x' ? h.substr(2) : h), 'hex').copy(ret, 12);

		return ret;
	}

}

class RuStupidDataBuilder {
	constructor(method, fields, decimalat=-1) {
		this.decimal_places = decimalat >= 0 ? decimalat : 18;
		this.multiplier = new web3.utils.BN(10).pow(new web3.utils.BN(this.decimal_places));
		this.current_offset = 4;
		this.buf = Buffer.allocUnsafe(4 + (fields * 32));
		Buffer.from(method).copy(this.buf);
	}

	putAddress(addr) {
		this.__addrToBuf(addr).copy(this.buf, this.current_offset);
		this.current_offset += 32;

		return this;
	}

	putUint256Scaled(val) {
		this.__numToUint256Scaled(val).copy(this.buf, this.current_offset);
		this.current_offset += 32;

		return this;
	}

	get() {
		return this.buf;
	}


	__numToUint256Scaled(value) {
		let ret = Buffer.alloc(32);
		let val = new web3.utils.BN(value).mul(this.multiplier).toBuffer('le', 0);
		val.copy(ret, 32 - val.byteLength);

		return ret;
	}

	__addrToBuf(h) {
		let ret = Buffer.alloc(32);
		Buffer.from((h.substr(0, 2) == '0x' ? h.substr(2) : h), 'hex').copy(ret, 12);

		return ret;
	}
}

class RuBetterERC20Encoder {
	constructor() {

	}

	encodeTransfer(toAddr, value) {
		return new RuStupidDataBuilder([0xa9, 0x05, 0x9c, 0xbb], 2, 18).putAddress(toAddr).putUint256Scaled(value).get();
	}

	encodeTransferFrom(fromaddr, toaddr, value) {
		return new RuStupidDataBuilder([0x23, 0xb8, 0x72, 0xdd], 3, 18).putAddress(fromaddr).putAddress(toaddr).putUint256Scaled(value).get();
	}

	encodeApprove(spenderAddr, value) {
		return new RuStupidDataBuilder([0x09, 0x5e, 0xa7, 0xb3], 2, 18).putAddress(spenderAddr).putUint256Scaled(value).get();
	}

	encodeCDAIMint(amount) {
		return new RuStupidDataBuilder([0xa0, 0x71, 0x2d, 0x68], 1, 18).putUint256Scaled(amount).get();
	}

	encodeCDAIRedeemUnderlying(amount) {
		return new RuStupidDataBuilder([0x85, 0x2a, 0x12, 0xe3], 1, 18).putUint256Scaled(amount).get();
	}
}


exports.RuERC20Encoder = RuERC20Encoder;

/*
const c = new RuERC20Encoder();
console.log(c.encodeTransfer('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeTransferFrom('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', '0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeCDAIMint(1024).toString('hex'));
console.log(c.encodeCDAIRedeemUnderlying(1024).toString('hex'));
const c1 = new RuBetterERC20Encoder();
console.log(c1.encodeTransfer('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c1.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c1.encodeTransferFrom('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', '0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c1.encodeCDAIMint(1024).toString('hex'));
console.log(c1.encodeCDAIRedeemUnderlying(1024).toString('hex'));
*/
