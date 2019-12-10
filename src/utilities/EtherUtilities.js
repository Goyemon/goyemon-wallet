'use strict';
class EtherUtilities {
  hexArrayToString(arr) {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      const dec = arr[i];
      const hexStr = Number(dec).toString(16);
      const str = hexStr.length == 1 ? `0${hexStr}` : hexStr;
      result += str;
    }
    return result;
  }

  stripHexPrefix(str) {
    return str.startsWith('0x') ? str.slice(2) : str;
  }
}

export default new EtherUtilities();
