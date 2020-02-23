'use strict';
class EtherUtilities {
  static hexArrayToString(array) {
    return Buffer.from(array).toString('hex');
  }

  static stripHexPrefix(string) {
    if (string) {
      return string.startsWith('0x') ? string.slice(2) : string;
    }
  }
}

export default EtherUtilities;
