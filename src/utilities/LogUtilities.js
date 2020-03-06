'use strict';

import { saveOtherDebugInfo } from '../actions/ActionDebugInfo';
import { store } from '../store/store';

class LogUtilities {
  static logInfo() {
    console.log(...arguments);
  }

  static logError() {
    console.error(...arguments);
  }

  static toDebugScreen() {
    if (arguments.length < 1)
      return;
    let out = arguments[0];
    for (let i = 1; i < arguments.length; ++i)
      out += ` || ${arguments[i]}`;
    store.dispatch(saveOtherDebugInfo(out));
  }

  static dumpObject() {
    if (arguments.length < 2)
      return;
    let out = `${arguments[0]} --> `;
    for (let i = 1; i < arguments.length; ++i) {
      const x = arguments[i];

      out += `[${typeof x}]`;
      for (id in x)
        out += `|| ${id}: x[id]`
    }

    LogUtilities.toDebugScreen(out);
  }
}

export default LogUtilities;
