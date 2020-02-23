'use strict';
class DebugUtilities {
  static logInfo() {
    console.log(...arguments);
  }

  static logError() {
    console.error(...arguments);
  }
}

export default DebugUtilities;
