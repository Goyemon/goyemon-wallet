'use strict';
class EtherUtilities {
  static hexArrayToString(array) {
    return Buffer.from(array).toString('hex');
  }
}

export default EtherUtilities;
