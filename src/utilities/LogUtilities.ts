'use strict';
import { saveOtherDebugInfo } from '../actions/ActionDebugInfo';
import { store } from '../store/store';
import PersistentLogging from '../lib/logging.js';

const DUMPOBJECT_DEFAULT_DEPTH = 4;

let log_line_number = 0;

class LogUtilities {
  static __getFormattedDate() {
    let d = new Date();
    return `${d.getHours() < 10 ? 0 : ''}${d.getHours()}${
      d.getMinutes() < 10 ? 0 : ''
    }${d.getMinutes()}${d.getSeconds() < 10 ? 0 : ''}${d.getSeconds()}`;
  }

  static logInfo(...args: any[]) {
    console.log(LogUtilities.__getFormattedDate(), ' ', ...args);
  }

  static logError(...args: any[]) {
    console.error(LogUtilities.__getFormattedDate(), ' ', ...args);
  }

  static toDebugScreen(...args: any[]) {
    if (args.length < 1) return;

    let out = `[${log_line_number++}] ${LogUtilities.__getFormattedDate()}`;
    for (let i = 0; i < args.length; ++i)
      out += ` ${
        args[i] instanceof Object && typeof args[i] != 'string'
          ? LogUtilities.__dumpObjectRecursively(args[i])
          : args[i]
      }`;

    PersistentLogging.timed_dump_str(out);

    store.dispatch(saveOtherDebugInfo(out));
    LogUtilities.logInfo(out); // because certain individual wont see it if it's not spammed on his screen
  }

  static dumpObject() {
    if (arguments.length < 2) return;
    let out = `${arguments[0]} --> `;
    for (let i = 1; i < arguments.length; ++i)
      out += `${i > 1 ? ' ' : ''}${LogUtilities.__dumpObjectRecursively(
        arguments[i]
      )}`;

    LogUtilities.toDebugScreen(out);
  }

  static __dumpObjectRecursively(
    x: any,
    level = 0,
    maxlevel = DUMPOBJECT_DEFAULT_DEPTH
  ):any {
    if (typeof x === 'string') return `"${x}"`;
    else if (typeof x === 'number') return `${x}`;
    else if (x instanceof Buffer) return `(Buffer)[${x.toString('hex')}]`;

    if (level <= maxlevel) {
      if (x instanceof Array)
        return `[${x
          .map(
            (x) =>
              `${LogUtilities.__dumpObjectRecursively(x, level + 1, maxlevel)}`
          )
          .join(', ')}]`;
      else if (x instanceof Object)
        return `{ ${Object.keys(x).map(
          (xk) =>
            `${xk}: ${LogUtilities.__dumpObjectRecursively(
              x[xk],
              level + 1,
              maxlevel
            )}`
        )} }`;
    }

    return `(${typeof x})${x}`;
  }
}

export default LogUtilities;
