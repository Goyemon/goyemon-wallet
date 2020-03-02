'use strict';
class LogUtilities {
  static logInfo() {
    console.log(...arguments);
  }

  static logError() {
    console.error(...arguments);
  }
}

export default LogUtilities;
