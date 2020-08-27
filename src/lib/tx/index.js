import TxStorage from './TxStorage';
import LogUtilities from '../../utilities/LogUtilities';

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

LogUtilities.toDebugScreen('this is tx storage', TxStorage);

export const storage = new TxStorage();
