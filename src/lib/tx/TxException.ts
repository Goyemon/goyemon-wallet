export class TxException extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = this.constructor.name;
  }
}

export class NoSuchTxException extends TxException {}
export class DuplicateNonceTxException extends TxException {}
export class DuplicateHashTxException extends TxException {}
