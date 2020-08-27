export class TxException extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;
  }
}

export class NoSuchTxException extends TxException {}
// class InvalidStateTxException extends TxException {}
export class DuplicateNonceTxException extends TxException {}
export class DuplicateHashTxException extends TxException {}
