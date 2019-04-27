'use strict';
class EthUtls {
  hexArrayToString(arr) {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      const dec = arr[i];
      const hexStr = Number(dec).toString(16);
      const str = hexStr.length == 1 ? `0${hexStr}` : hexStr;
      result = result + str;
    }
    return result;
  }
}

export default new EthUtls();
