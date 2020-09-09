const AsyncStorage = require('@react-native-community/async-storage');

const log_prefix = 'l_';
const dump_timer_interval = 5000;
const log_ms_retention = 86400 * 3 * 1000;
const run_cleanup_delay = 30000;

class PersistentLogging {
  lastkey: any;
  lastkeyno: any;
  dumptimer: any;
  dumptimerarray: any;
  constructor() {
    this.lastkey = null;
    this.lastkeyno = 0;

    this.dumptimer = null;
    this.dumptimerarray = [];

    setTimeout(this.cleanup_expensive.bind(this), run_cleanup_delay);
  }

  __check_timer() {
    if (!this.dumptimer)
      setTimeout(() => {
        this.dumplog(this.dumptimerarray);

        this.dumptimer = null;
        this.dumptimerarray = [];
      }, dump_timer_interval);
  }

  timed_dump(logArray: any) {
    this.__check_timer();
    logArray.forEach((x: any) => {
      // this.dumptimerarray.splice(-1, 0, ...logArray) is risky if logArray is long
      this.dumptimerarray.push(x);
    });

    return this;
  }

  timed_dump_str(log: any) {
    this.__check_timer();
    this.dumptimerarray.push(log);

    return this;
  }

  dumplog(logArray: any) {
    const now = Date.now();
    let storage_key;

    if (this.lastkey == now) {
      storage_key = `${log_prefix}${now}_${this.lastkeyno++}`;
    } else {
      this.lastkeyno = 0;
      storage_key = `${log_prefix}${now}`;
    }

    this.lastkey = now;

    AsyncStorage.setItem(storage_key, JSON.stringify(logArray)); // catch errors?

    return this;
  }

  cleanup_expensive(retention_time = log_ms_retention) {
    // run with 0 to remove all i guess
    AsyncStorage.getAllKeys().then((x: any) => {
      const remove_keys: any[] = [];
      const cutoff = Date.now() - retention_time;
      x.forEach((x: any) => {
        if (x.startsWith(log_prefix)) {
          const dashpos = x.indexOf('_', log_prefix.length);
          if (
            (dashpos >= 0 &&
              parseInt(x.slice(log_prefix.length, dashpos - 1)) < cutoff) ||
            parseInt(x.slice(log_prefix.length)) < cutoff
          )
            remove_keys.push(x);
        }
      });
      if (remove_keys.length > 0) {
        this.timed_dump_str(
          `PersistentLogging: Removing old keys: ${remove_keys.join(', ')}`
        );
        AsyncStorage.multiRemove(remove_keys);
      }
    });
  }

  async get_all_logs() {
    const ret: any = {};
    const keys: any[] = [];

    (await AsyncStorage.getAllKeys()).forEach((x: any) => {
      if (x.startsWith(log_prefix)) keys.push(x);
    });
    /*
		keys.sort((a, b) => {
			const ta = a.substr(log_prefix.length).split('_').map(x => parseInt(x));
			const tb = b.substr(log_prefix.length).split('_').map(x => parseInt(x));;

			if (ta[0] != tb[0])
				return ta[0] - tb[0];

			if (ta[1] && tb[1])
				return ta[1] - tb[1];

			if (ta[1])
				return 1;

			return -1;
		});
		*/
    (await AsyncStorage.multiGet(keys)).forEach(([k, v]: any) => {
      ret[k.slice(log_prefix.length)] = v;
    });

    return ret;
  }
}

export default new PersistentLogging();
