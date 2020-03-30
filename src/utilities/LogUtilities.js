'use strict';

import { saveOtherDebugInfo } from '../actions/ActionDebugInfo';
import { store } from '../store/store';

const DUMPOBJECT_DEFAULT_DEPTH = 4;

var log_line_number = 0;

class LogUtilities {
	static __getFormattedDate() {
		let d = new Date();
		return `${d.getHours() < 10 ? 0 : ""}${d.getHours()}${d.getMinutes() < 10 ? 0 : ""}${d.getMinutes()}${d.getSeconds() < 10 ? 0 : ""}${d.getSeconds()}`;
	}

	static logInfo() {
		console.log(LogUtilities.__getFormattedDate(), ' ', ...arguments);
	}

	static logError() {
		console.error(LogUtilities.__getFormattedDate(), ' ', ...arguments);
	}

	static toDebugScreen() {
		if (arguments.length < 1)
			return;

		let out = `[${log_line_number++}] ${LogUtilities.__getFormattedDate()}`;
		for (let i = 0; i < arguments.length; ++i)
			out += ` ${arguments[i] instanceof Object ? LogUtilities.__dumpObjectRecursively(arguments[i]) : arguments[i]}`;

		store.dispatch(saveOtherDebugInfo(out));
		LogUtilities.logInfo(out); // because certain individual wont see it if it's not spammed on his screen
	}

	static dumpObject() {
		if (arguments.length < 2)
			return;
		let out = `${arguments[0]} --> `;
		for (let i = 1; i < arguments.length; ++i)
			out += `${i > 1 ? " " : ""}${LogUtilities.__dumpObjectRecursively(arguments[i])}`;

		LogUtilities.toDebugScreen(out);
	}

	static __dumpObjectRecursively(x, level=0, maxlevel=DUMPOBJECT_DEFAULT_DEPTH) {
		let out = `(${typeof x})`;

		for (let id in x) {
			if (level <= maxlevel) {
				if (x[id] instanceof Buffer)
					out += ` ${id}: (Buffer)[${x[id].toString("hex")}]`;
				else if (x[id] instanceof Array) {
					out += ` ${id}: (Array)[${x[id].map(x => LogUtilities.__dumpObjectRecursively(x)).join(", ")}]`;
				}
				else if (x[id] instanceof Object)
					out += ` ${id}(Object): { ${LogUtilities.__dumpObjectRecursively(x[id], level + 1, maxlevel)} }`;
				else
					out += ` ${id}: ${x[id]}`;

				continue;
			}

			out += ` ${id}: ${x[id]}`;
		}

		return out;
	}
}

export default LogUtilities;
