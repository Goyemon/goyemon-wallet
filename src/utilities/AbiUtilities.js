'use strict';
const web3 = require('web3');
// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html
// https://github.com/indutny/bn.js/blob/master/lib/bn.js

class RuDataBuilder {
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
		return `0x${this.buf.toString('hex')}`;
	}


	__numToUint256Scaled(value) {
		let ret = Buffer.alloc(32);
		let val = new web3.utils.BN(value).mul(this.multiplier).toBuffer('be', 0);
		val.copy(ret, 32 - val.byteLength);

		return ret;
	}

	__addrToBuf(h) {
		let ret = Buffer.alloc(32);
		Buffer.from((h.substr(0, 2) == '0x' ? h.substr(2) : h), 'hex').copy(ret, 12);

		return ret;
	}
}

class ABIEncoder {
	static encodeTransfer(toAddr, value, decimals=18) {
		return new RuDataBuilder([0xa9, 0x05, 0x9c, 0xbb], 2, decimals).putAddress(toAddr).putUint256Scaled(value).get();
	}

	static encodeTransferFrom(fromaddr, toaddr, value, decimals=18) {
		return new RuDataBuilder([0x23, 0xb8, 0x72, 0xdd], 3, decimals).putAddress(fromaddr).putAddress(toaddr).putUint256Scaled(value).get();
	}

	static encodeApprove(spenderAddr, value, decimals=18) {
		return new RuDataBuilder([0x09, 0x5e, 0xa7, 0xb3], 2, decimals).putAddress(spenderAddr).putUint256Scaled(value).get();
	}

	static encodeCDAIMint(amount, decimals=18) {
		return new RuDataBuilder([0xa0, 0x71, 0x2d, 0x68], 1, decimals).putUint256Scaled(amount).get();
	}

	static encodeCDAIRedeemUnderlying(amount, decimals=18) {
		return new RuDataBuilder([0x85, 0x2a, 0x12, 0xe3], 1, decimals).putUint256Scaled(amount).get();
	}
}


export default ABIEncoder;

/*
const c = new RuABIEncoder();
console.log(c.encodeTransfer('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeTransferFrom('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', '0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(c.encodeCDAIMint(1024).toString('hex'));
console.log(c.encodeCDAIRedeemUnderlying(1024).toString('hex'));
const c1 = new RuBetterABIEncoder();
console.log(RuBetterABIEncoder.encodeTransfer('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(RuBetterABIEncoder.encodeApprove('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(RuBetterABIEncoder.encodeTransferFrom('0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', '0x3f55a0fad848176a4f32618dcfd033ac0a13ce80', 1024).toString('hex'));
console.log(RuBetterABIEncoder.encodeCDAIMint(1024).toString('hex'));
console.log(RuBetterABIEncoder.encodeCDAIRedeemUnderlying(1024).toString('hex'));
*/
