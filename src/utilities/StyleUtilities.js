'use strict';

class StyleUtilities {
  static getBorderColor(validation) {
    if (validation === undefined) {
      return '#FFF';
    } else if (validation) {
      return '#1BA548';
    } else if (!validation) {
      return '#E41B13';
    }
  }
}

export default StyleUtilities;
