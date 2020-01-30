'use strict';
class DebugUtilities {
  logInfo() {
    console.log(...arguments);
  }

  logError() {
    console.error(...arguments);
  }
}

export default new DebugUtilities();
