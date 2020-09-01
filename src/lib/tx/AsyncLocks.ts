export default class AsyncLocks {
  locks: any;

  constructor() {
    this.locks = {};
  }

  async lock(name: any) {
    let l = this.locks[name];
    while (
      l &&
      l.promise // we wait as long as there is a promise to be awaited
    )
      await l.promise; // the other "thread" will resolve and clear that promise.

    if (!l) l = this.locks[name] = {};

    // no promise, we're ready to go. create a new promise and insert it into locks, so that other threads can wait for it.
    l.promise = new Promise((resolve, reject) => {
      l.resolve = resolve;
      l.reject = reject;
    });
  }

  unlock(name: any) {
    let l = this.locks[name];
    if (!l || !l.promise)
      throw new Error(`unlock() called on a non-locked lock ${name}`);

    l.resolve();
    delete l.promise;
    delete l.resolve;
    delete l.reject;
  }
}
