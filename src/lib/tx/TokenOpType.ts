export const TxTokenOpTypeToName = {
  // names inside txhistory object
  transfer: "tr",
  approval: "appr",
  failure: "failure",
  mint: "mint",
  redeem: "redeem",
  eth2tok: "eth2tok",
  tok2eth: "tok2eth",
  U2swap: "U2swap",
  PTdeposited: "PTdep",
  PTdepositedAndCommitted: "PTdepc",
  PTsponsorshipDeposited: "PTspdep",
  PTwithdrawn: "PTwdrw",
  PTopenDepositWithdrawn: "PTopdepwi",
  PTsponsorshipAndFeesWithdrawn: "PTspafwi",
  PTcommittedDepositWithdrawn: "PTcodewi",
  PTrewarded: "PTrew"
};

class TxTokenOp {
  freeze() {
    Object.freeze(this);
    return this;
  }

  deepClone() {
    return Object.assign(new TxTokenOp(), this);
  }
}

class TxTokenMintOp extends TxTokenOp {
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  minter: string | null;
  mintUnderlying: string | null;
  mintAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  redeemer: string | null;
  redeemUnderlying: string | null;
  redeemAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  amount: string | number | null;
  eth_sold?: string | number | null;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  spender: string | null;
  approver: string | null;
  amount: string | number | null;
  eth_sold?: string | number | null;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  error: string | null;
  detail: string | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  eth_sold: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  tok_sold: string | number | null;
  eth_bought: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  sender: string | number | null;
  amount0In: string | number | null;
  eth_sold: string | number | null;
  amount1Out: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  depositor: string | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  depositor: string | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  depositor: string | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  withdrawer: string | null;
  withdrawAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  withdrawer: string | null;
  withdrawAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  withdrawer: string | null;
  withdrawAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  withdrawer: string | null;
  withdrawAmount: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
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
  mintUnderlying?: any;
  redeemUnderlying?: any;
  withdrawAmount?: any;
  tok_bought: any;
  depositPoolAmount: any;
  from_addr: any;
  to_addr: any;
  info: any;
  winner: string | null;
  winnings: string | number | null;
  eth_sold?: string | number | null;
  amount?: any;
  constructor(arr: any) {
    super();
    [this.winner, this.winnings] = arr;
    // this.winner = arr[0]; this.winnings = arr[1];
  }

  toJSON() {
    return { [TxTokenOpTypeToName.PTrewarded]: [this.winner, this.winnings] };
  }
}

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
