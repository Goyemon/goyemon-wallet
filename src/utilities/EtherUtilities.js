'use strict';
class EtherUtilities {
  hexArrayToString(array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
      const dec = array[i];
      const hexString = Number(dec).toString(16);
      const string = hexString.length == 1 ? `0${hexString}` : hexString;
      result += string;
    }
    return result;
  }

  stripHexPrefix(string) {
    if (string != null) {
      return string.startsWith('0x') ? string.slice(2) : string;
    }
  }
}

export default new EtherUtilities();
