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
		for (let i = 1; i < arguments.length; ++i)
			out += LogUtilities.__dumpObjectRecursively(arguments[i]);

		LogUtilities.toDebugScreen(out);
	}

	static __dumpObjectRecursively(x, level=0, maxlevel=2) {
		let out = '';

		for (let id in x) {
			if (level <= maxlevel) {
				if (x[id] instanceof Buffer)
					out += ` ${id}: [Buffer][${x[id].toString("hex")}]`;
				else if (x[id] instanceof Object)
					out += ` ${id}[Object]: ${LogUtilities.__dumpObjectRecursively(x[id], level + 1, maxlevel)}`;
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
