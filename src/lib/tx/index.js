import GlobalConfig from '../../config.json';
import TxStorage from './TxStorage';

export const TxStates = {
  STATE_GETH_ERROR: -1,
  STATE_NEW: 0,
  STATE_PENDING: 1,
  STATE_INCLUDED: 2,
  STATE_CONFIRMED: 3
};

export const TxTokenOpTypeToName = {
  // names inside txhistory object
  transfer: 'tr',
  approval: 'appr',
  failure: 'failure',
  mint: 'mint',
  redeem: 'redeem',
  eth2tok: 'eth2tok',
  tok2eth: 'tok2eth',
  U2swap: 'U2swap',
  PTdeposited: 'PTdep',
  PTdepositedAndCommitted: 'PTdepc',
  PTsponsorshipDeposited: 'PTspdep',
  PTwithdrawn: 'PTwdrw',
  PTopenDepositWithdrawn: 'PTopdepwi',
  PTsponsorshipAndFeesWithdrawn: 'PTspafwi',
  PTcommittedDepositWithdrawn: 'PTcodewi',
  PTrewarded: 'PTrew'
};

// ========== helper functions ==========
function dropHexPrefix(hex) {
  return typeof hex === 'string'
    ? hex.startsWith('0x')
      ? hex.substr(2)
      : hex
    : hex;
}

function hexToBuf(hex) {
  return typeof hex === 'string'
    ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex')
    : null;
}

// ========== locks ==========

// ========== storage abstraction ==========
/*
	prefix is a storage-wide prefix.
	hash is transaction hash

	${prefix}_${hash} for txdata (hash can be nonce_${number})
	${prefix}iall${num} for buckets (counts from 0)
	${prefix}iallc for item count
	${prefix}i${indexname}${num} for buckets again
	${prefix}i${indexname}c for count in given index

	`all' is just an index name for all items.
	hashes in buckets are always sorted by timestamp
*/

// ========== exceptions ==========
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

// ========== token operations ==========
// TODO: replace these with a factory

class TxTokenOp {
  /*toJSON() {
		return this.constructor.name;
	}*/

  freeze() {
    Object.freeze(this);
    return this;
  }

  deepClone() {
    return Object.assign(new this.constructor([]), this);
  }
}

class TxTokenMintOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.minter, this.mintUnderlying, this.mintAmount] = arr;
    // this.minter = arr[0]; this.mintAmount = arr[1]; this.mintUnderlying = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.mint]: [
        this.minter,
        this.mintUnderlying,
        this.mintAmount
      ]
    };
  }
}

class TxTokenRedeemOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.redeemer, this.redeemUnderlying, this.redeemAmount] = arr;
    // this.redeemer = arr[0]; this.redeemAmount = arr[1]; this.redeemUnderlying = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.redeem]: [
        this.redeemer,
        this.redeemUnderlying,
        this.redeemAmount
      ]
    };
  }
}

class TxTokenTransferOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.to_addr, this.amount] = arr;
    // this.from_addr = arr[0]; this.to_addr = arr[1]; this.amount = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.transfer]: [
        this.from_addr,
        this.to_addr,
        this.amount
      ]
    };
  }
}

class TxTokenApproveOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.spender, this.approver, this.amount] = arr;
    // this.approver = arr[0]; this.spender = arr[1]; this.amount = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.approval]: [this.spender, this.approver, this.amount]
    };
  }
}

class TxTokenFailureOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.error, this.info, this.detail] = arr;
    // this.error = arr[0]; this.info = arr[1]; this.detail = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.failure]: [this.error, this.info, this.detail]
    };
  }
}

class TxTokenEth2TokOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.eth_sold, this.tok_bought] = arr;
    // this.from_addr = arr[0]; this.eth_sold = arr[1]; this.tok_bought = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.eth2tok]: [
        this.from_addr,
        this.eth_sold,
        this.tok_bought
      ]
    };
  }
}

class TxTokenTok2EthOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.from_addr, this.tok_sold, this.eth_bought] = arr;
    // this.from_addr = arr[0]; this.tok_sold = arr[1]; this.eth_bought = arr[2];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.tok2eth]: [
        this.from_addr,
        this.tok_sold,
        this.eth_bought
      ]
    };
  }
}

class TxTokenU2swapOp extends TxTokenOp {
  constructor(arr) {
    super();
    [
      this.sender,
      this.amount0In,
      this.eth_sold,
      this.tok_bought,
      this.amount1Out,
      this.from_addr
    ] = arr;
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.U2swap]: [
        this.sender,
        this.amount0In,
        this.eth_sold,
        this.tok_bought,
        this.amount1Out,
        this.from_addr
      ]
    };
  }
}

class TxTokenPTdepositedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTdeposited]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTdepositedAndCommittedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTdepositedAndCommitted]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTsponsorshipDepositedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.depositor, this.depositPoolAmount] = arr;
    // this.depositor = arr[0]; this.depositPoolAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTsponsorshipDeposited]: [
        this.depositor,
        this.depositPoolAmount
      ]
    };
  }
}

class TxTokenPTwithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTwithdrawn]: [this.withdrawer, this.withdrawAmount]
    };
  }
}

class TxTokenPTopenDepositWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTopenDepositWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTsponsorshipAndFeesWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTcommittedDepositWithdrawnOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.withdrawer, this.withdrawAmount] = arr;
    // this.withdrawer = arr[0]; this.withdrawAmount = arr[1];
  }

  toJSON() {
    return {
      [TxTokenOpTypeToName.PTcommittedDepositWithdrawn]: [
        this.withdrawer,
        this.withdrawAmount
      ]
    };
  }
}

class TxTokenPTrewardedOp extends TxTokenOp {
  constructor(arr) {
    super();
    [this.winner, this.winnings] = arr;
    // this.winner = arr[0]; this.winnings = arr[1];
  }

  toJSON() {
    return { [TxTokenOpTypeToName.PTrewarded]: [this.winner, this.winnings] };
  }
}

/*
function createTxOpClass(fieldlist) {
	let cls = function(arr) {
		super();

	}
	return class extends TxTokenOp {
		constructor(arr) {
			super();
			let i = 0;
			fieldlist.forEach(x => {
				this[x] = arr[i++];
			});
		}

		toJSON() {
			return
		}
	}
}
*/

// ========== actual transaction data storage class ==========
export const TxTokenOpNameToClass = {
  // name -> tokenop storage class
  [TxTokenOpTypeToName.transfer]: TxTokenTransferOp,
  [TxTokenOpTypeToName.approval]: TxTokenApproveOp,
  [TxTokenOpTypeToName.failure]: TxTokenFailureOp,
  [TxTokenOpTypeToName.mint]: TxTokenMintOp,
  [TxTokenOpTypeToName.redeem]: TxTokenRedeemOp,
  [TxTokenOpTypeToName.eth2tok]: TxTokenEth2TokOp,
  [TxTokenOpTypeToName.tok2eth]: TxTokenTok2EthOp,
  [TxTokenOpTypeToName.U2swap]: TxTokenU2swapOp,
  [TxTokenOpTypeToName.PTdeposited]: TxTokenPTdepositedOp,
  [TxTokenOpTypeToName.PTdepositedAndCommitted]: TxTokenPTdepositedAndCommittedOp,
  [TxTokenOpTypeToName.PTsponsorshipDeposited]: TxTokenPTsponsorshipDepositedOp,
  [TxTokenOpTypeToName.PTwithdrawn]: TxTokenPTwithdrawnOp,
  [TxTokenOpTypeToName.PTopenDepositWithdrawn]: TxTokenPTopenDepositWithdrawnOp,
  [TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn]: TxTokenPTsponsorshipAndFeesWithdrawnOp,
  [TxTokenOpTypeToName.PTcommittedDepositWithdrawn]: TxTokenPTcommittedDepositWithdrawnOp,
  [TxTokenOpTypeToName.PTrewarded]: TxTokenPTrewardedOp
};

export class Tx {
  constructor(state) {
    this.from_addr = this.to_addr = this.value = this.gas = this.gasPrice = this.timestamp = this.nonce = this.hash = null;
    this.state = state !== undefined ? state : null;
    this.tokenData = {};
    this.data = {}; // for additional items, such as transaction input field
  }

  setFrom(addr) {
    this.from_addr = hexToBuf(addr);
    return this;
  }

  setTo(addr) {
    this.to_addr = hexToBuf(addr);
    return this;
  }

  setHash(hash) {
    //this.hash = hexToBuf(hash);
    this.hash = hash;
    return this;
  }

  setNonce(nonce) {
    this.nonce = nonce;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  setGas(value) {
    this.gas = value;
    return this;
  }

  setGasPrice(value) {
    this.gasPrice = value;
    return this;
  }

  setTimestamp(tstamp) {
    this.timestamp = tstamp;
    return this;
  }

  setState(state) {
    this.state = state;
    return this;
  }

  tempSetData(data) {
    // misleading now; means transaction input field
    this.data.data = data;
    return this;
  }

  tempDropData() {
    delete this.data.data;
    return this;
  }

  upgradeState(new_state, new_timestamp) {
    // updates state and timestamp ONLY if the new state is a later state (so, we cant go back from confirmed to included, for example)
    if (new_state >= this.state) {
      this.state = new_state;
      this.timestamp = new_timestamp;
    }
    // else ignore downgrade attempts, not an error

    return this;
  }

  fromDataArray(data, fromFCM = true) {
    this.tokenData = {};

    if (data.length > 8) {
      // we have token data.
      if (fromFCM)
        Object.entries(data[8]).forEach(([token, ops]) =>
          Object.entries(ops).forEach(([op, opdata]) =>
            opdata.forEach((opdata) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x) => dropHexPrefix(x))
              )
            )
          )
        );
      else {
        Object.entries(data[8]).forEach(([token, ops]) =>
          ops.forEach((opdescr) =>
            Object.entries(opdescr).forEach(([op, opdata]) =>
              this.addTokenOperation(
                token,
                op,
                opdata.map((x) => dropHexPrefix(x))
              )
            )
          )
        );
      }
    }

    if (data.length > 10) this.data = data[10];

    return this.setFrom(data[0])
      .setTo(data[1])
      .setGas(dropHexPrefix(data[2]))
      .setGasPrice(dropHexPrefix(data[3]))
      .setValue(dropHexPrefix(data[4]))
      .setNonce(typeof data[5] === 'string' ? parseInt(data[5]) : data[5])
      .upgradeState(data[7], data[6]);
  }

  addTokenOperation(token, operation, data) {
    if (this.tokenData.hasOwnProperty(token))
      this.tokenData[token].push(new TxTokenOpNameToClass[operation](data));
    else this.tokenData[token] = [new TxTokenOpNameToClass[operation](data)];

    return this;
  }

  hasTokenOperations(token) {
    return this.tokenData.hasOwnProperty(token);
  }

  hasTokenOperation(token, operation) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return false;

    const cls = TxTokenOpNameToClass[operation];
    return this.tokenData[token].some((x) => x instanceof cls);
  }

  getTokenOperations(token, operation) {
    // TODO: retink. we shouldnt iterate, even though those aren't huge arrays.
    if (!this.tokenData.hasOwnProperty(token)) return [];
    const cls = operation ? TxTokenOpNameToClass[operation] : null;
    return this.tokenData[token].filter(
      (x) => operation == null || x instanceof cls
    );
  }

  getAllTokenOperations() {
    return this.tokenData;
  }

  getFrom() {
    return this.from_addr ? `0x${this.from_addr.toString('hex')}` : null;
  }

  getTo() {
    return this.to_addr ? `0x${this.to_addr.toString('hex')}` : null;
  }

  getHash() {
    //return this.hash ? this.hash.toString('hex') : null;
    return this.hash;
  }

  getApplication(to) {
    const UniswapV1 = '0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667';
    const UniswapV2 = '0xf164fc0ec4e93095b804a4795bbe1e041497b92a';
    if (to) {
      switch (to.toLowerCase()) {
        case GlobalConfig.cDAIcontract.toLowerCase():
          return 'Compound';
        case UniswapV1:
        case UniswapV2:
        case GlobalConfig.RouterUniswapV2.toLowerCase():
          return 'Uniswap';
        case GlobalConfig.DAIPoolTogetherContractV2.toLowerCase():
          return 'PoolTogether';
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  getState() {
    return this.state;
  }

  getValue() {
    return this.value ? this.value : 0;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getNonce() {
    return this.nonce;
  }

  getGasPrice() {
    return this.gasPrice;
  }

  getGasLimit() {
    return this.gas;
  }

  toTransactionDict() {
    return {
      nonce: `0x${this.nonce.toString(16)}`,
      to: this.getTo(),
      gasPrice: `0x${this.gasPrice}`,
      gasLimit: `0x${this.gas}`,
      value: `0x${this.getValue()}`,
      chainId: GlobalConfig.network_id,
      data: this.data.data
    };
  }

  toJSON() {
    return [
      this.getFrom(),
      this.getTo(),
      this.gas,
      this.gasPrice,
      this.value,
      this.nonce,
      this.timestamp,
      this.state,
      this.tokenData,
      this.data
    ];
  }

  shallowClone() {
    /*let newtx = new Tx(this.state);
		Object.entries(this).forEach(([k, v]) => if (typeof v !== 'function') newtx[k] = v; );
		return newtx;*/
    return Object.assign(new Tx(), this);
  }

  deepClone() {
    let ntx = Object.assign(new Tx(), this);
    ntx.tokenData = Object.assign({}, ntx.tokenData);
    ntx.data = Object.assign({}, ntx.data); // expected to be a simple key => value map, so a shallow clone of this should be sufficient for now.

    for (let n of Object.getOwnPropertyNames(ntx.tokenData))
      ntx.tokenData[n] = ntx.tokenData[n].map((x) => x.deepClone());

    return ntx;
  }

  freeze() {
    for (let n of Object.getOwnPropertyNames(this.tokenData)) {
      this.tokenData[n].forEach((x) => x.freeze());
      Object.freeze(this.tokenData[n]);
    }
    Object.freeze(this.data);
    Object.freeze(this.tokenData);
    Object.freeze(this);

    return this;
  }
}

export const storage = new TxStorage();
