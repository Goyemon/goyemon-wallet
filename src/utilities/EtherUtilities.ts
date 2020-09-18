"use strict";
import TransactionUtilities from "./TransactionUtilities";
import {
  TxTokenOpNameToClass,
  TxTokenOpTypeToName
} from "../lib/tx/TokenOpType";

interface TopField {
  eth_sold?: any;
  tok_bought?: any;
  depositPoolAmount?: any;
  amount?: any;
  from_addr?: any;
  to_addr?: any;
  info?: any;
  mintUnderlying?: any;
  redeemUnderlying?: any;
  winnings?: any;
  withdrawAmount?: any;
}

export default class EtherUtilities {
  static hexArrayToString(array: any) {
    return Buffer.from(array).toString("hex");
  }

  static getAddressWithout0x(address: any) {
    const addressWithout0x =
      address.substr(0, 2) == "0x" && address.length > 2
        ? address.substr(2)
        : address.length < 2
        ? "0000000000000000000000000000000000000000"
        : address;
    return addressWithout0x.toLowerCase();
  }

  static getCompoundErrorCode(code: any) {
    switch (true) {
      case 30 <= code && 38 >= code:
        return "mint";
      case 39 <= code && 47 >= code:
        return "redeem";
      case 74 <= code:
        return "transfer";
      default:
        return "unknown";
    }
  }

  static topType(top: TopField, toptok: any, our_address_without_0x: any) {
    // LogUtilities.toDebugScreen('computeTxData -> ', typeof top);
    if (
      top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.eth2tok] ||
      top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.U2swap]
    )
      return {
        type: "swap",
        eth_sold: parseFloat(
          TransactionUtilities.parseETHValue(`0x${top.eth_sold}`)
        ).toFixed(4),
        tokens_bought: TransactionUtilities.parseHexDAIValue(
          `0x${top.tok_bought}`
        ),
        token: toptok
      };

    if (
      top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.PTdeposited] ||
      top instanceof
        TxTokenOpNameToClass[TxTokenOpTypeToName.PTdepositedAndCommitted] ||
      top instanceof
        TxTokenOpNameToClass[TxTokenOpTypeToName.PTsponsorshipDeposited]
    )
      return {
        type: "deposit",
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.depositPoolAmount}`
        ),
        token: "DAI"
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.transfer])
      return {
        type: "transfer",
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.amount}`),
        direction:
          top.from_addr === our_address_without_0x
            ? top.to_addr.toLowerCase() === our_address_without_0x.toLowerCase()
              ? "self"
              : "outgoing"
            : top.to_addr === our_address_without_0x
            ? "incoming"
            : "unknown",
        token: toptok
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.failure]) {
      return {
        type: "failure",
        failop: this.getCompoundErrorCode(parseInt(top.info, 16)),
        token: toptok
      };
    }

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.approval])
      return {
        type: "approval",
        token: toptok
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.mint])
      return {
        type: "deposit",
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.mintUnderlying}`
        ),
        token: toptok
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.redeem])
      return {
        type: "withdraw",
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.redeemUnderlying}`
        ),
        token: toptok
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.PTrewarded])
      return {
        type: "rewarded",
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.winnings}`),
        token: toptok
      };

    if (top instanceof TxTokenOpNameToClass[TxTokenOpTypeToName.PTwithdrawn])
      return {
        type: "withdraw",
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxTokenOpNameToClass[TxTokenOpTypeToName.PTopenDepositWithdrawn]
    )
      return {
        type: "open deposit withdraw",
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxTokenOpNameToClass[TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn]
    )
      return {
        type: "sponsorship withdraw",
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxTokenOpNameToClass[TxTokenOpTypeToName.PTcommittedDepositWithdrawn]
    )
      return {
        type: "committed deposit withdraw",
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    return {
      type: "oops"
    };
  }
}
