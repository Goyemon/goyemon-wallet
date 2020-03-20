'use strict';

/*
'!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ'
>>> len(x)
187
*/

const base128_chrs = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ'.split('').map(x => x.charCodeAt(0));
const base128_chrtobyte = (() => { let ret = {}; base128_chrs.map((v, idx) => ret[v] = idx); return ret; })();

export default class base128 {
	static toBase128(buf) {
		if (buf.length == 0)
			return '';

		let ret = new Buffer.allocUnsafe(buf.length + Math.ceil(buf.length / 7));
		let reti = 0;

		let carry = 0;
		let ncarry;

		for (let i = 0; i < buf.length; ++i) {
			const c = buf[i];
			switch (i % 7) {
				//case 7: ncarry = (c & 0x01) << 6; ret[reti] = carry; reti++; ret[reti] = c >> 1; break;
				case 6: ncarry = 0;             ret[reti++] = base128_chrs[carry | (c >> 7)]; ret[reti] = base128_chrs[c & 0x7f]; break;
				case 5: ncarry = (c & 0x3f) << 1; ret[reti] = base128_chrs[carry | (c >> 6)]; break;
				case 4: ncarry = (c & 0x1f) << 2; ret[reti] = base128_chrs[carry | (c >> 5)]; break;
				case 3: ncarry = (c & 0x0f) << 3; ret[reti] = base128_chrs[carry | (c >> 4)]; break;
				case 2: ncarry = (c & 0x07) << 4; ret[reti] = base128_chrs[carry | (c >> 3)]; break;
				case 1: ncarry = (c & 0x03) << 5; ret[reti] = base128_chrs[carry | (c >> 2)]; break; // carry 2 bits
				case 0: ncarry = (c & 0x01) << 6; ret[reti] = base128_chrs[c >> 1]; break; // carry 1 bit
			}

			reti++;

			carry = ncarry;
		}
		ret[reti] = base128_chrs[carry];

		return ret.toString('latin1');
	}

	static fromBase128(str) {
		str = Buffer.from(str, 'latin1');

		let ret = new Buffer.allocUnsafe(Math.floor(str.length * 7 / 8));
		let reti = 0;
		for (let i = 0; i < str.length; ++i) {
			const c = base128_chrtobyte[str[i]];
			const c1 = base128_chrtobyte[str[i+1]];

			switch (i % 8) {
				case 0: ret[reti] = ((c & 0xff) << 1) | (c1 >> 6); break;
				case 1: ret[reti] = ((c & 0x3f) << 2) | (c1 >> 5); break;
				case 2: ret[reti] = ((c & 0x1f) << 3) | (c1 >> 4); break;
				case 3: ret[reti] = ((c & 0x0f) << 4) | (c1 >> 3); break;
				case 4: ret[reti] = ((c & 0x07) << 5) | (c1 >> 2); break;
				case 5: ret[reti] = ((c & 0x03) << 6) | (c1 >> 1); break;
				case 6: ret[reti] = ((c & 0x01) << 7) | (c1); i++; break;
				case 7: ret[reti] = c << 1; break;
			}

			reti++;
		}

		return ret;
	}
}
