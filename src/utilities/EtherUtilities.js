'use strict';
import TransactionUtilities from './TransactionUtilities';
import TxStorage from '../lib/tx';

class EtherUtilities {
  static hexArrayToString(array) {
    return Buffer.from(array).toString('hex');
  }

  static getAddressWithout0x(checksumAddress) {
    const addressWithout0x =
      checksumAddress.substr(0, 2) == '0x' && checksumAddress.length > 2
        ? checksumAddress.substr(2)
        : checksumAddress.length < 2
        ? '0000000000000000000000000000000000000000'
        : checksumAddress;
    return addressWithout0x.toLowerCase();
  }

  static getCompErrorCode(code) {
    switch (true) {
      case 30 <= code && 38 >= code:
        return 'mint';
      case 39 <= code && 47 >= code:
        return 'redeem';
      case 74 <= code:
        return 'transfer';
      default:
        return 'unknown';
    }
  }

  static topType(top, toptok, our_address_without_0x) {
    // LogUtilities.toDebugScreen('computeTxData -> ', typeof top);
    if (
      top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.eth2tok] ||
      top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.U2swap]
    )
      return {
        type: 'swap',
        eth_sold: parseFloat(
          TransactionUtilities.parseETHValue(`0x${top.eth_sold}`)
        ).toFixed(4),
        tokens_bought: TransactionUtilities.parseHexDAIValue(
          `0x${top.tok_bought}`
        ),
        token: toptok
      };

    if (
      top instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTdeposited
        ] ||
      top instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTdepositedAndCommitted
        ] ||
      top instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTsponsorshipDeposited
        ]
    )
      return {
        type: 'deposit',
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.depositPoolAmount}`
        ),
        token: 'DAI'
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.transfer]
    )
      return {
        type: 'transfer',
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.amount}`),
        direction:
          top.from_addr === our_address_without_0x
            ? top.to_addr.toLowerCase() === our_address_without_0x.toLowerCase()
              ? 'self'
              : 'outgoing'
            : top.to_addr === our_address_without_0x
            ? 'incoming'
            : 'unknown',
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.failure]
    ) {
      return {
        type: 'failure',
        failop: this.getCompErrorCode(parseInt(top.info, 16)),
        token: toptok
      };
    }

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.approval]
    )
      return {
        type: 'approval',
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.mint]
    )
      return {
        type: 'deposit',
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.mintUnderlying}`
        ),
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.redeem]
    )
      return {
        type: 'withdraw',
        amount: TransactionUtilities.parseHexDAIValue(
          `0x${top.redeemUnderlying}`
        ),
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.PTrewarded]
    )
      return {
        type: 'rewarded',
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.winnings}`),
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.PTwithdrawn]
    )
      return {
        type: 'withdraw',
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[
        TxStorage.TxTokenOpTypeToName.PTopenDepositWithdrawn
      ]
    )
      return {
        type: 'open deposit withdraw',
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[
        TxStorage.TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn
      ]
    )
      return {
        type: 'sponsorship withdraw',
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[
        TxStorage.TxTokenOpTypeToName.PTcommittedDepositWithdrawn
      ]
    )
      return {
        type: 'committed deposit withdraw',
        token: toptok,
        amount: TransactionUtilities.parseHexDAIValue(`0x${top.withdrawAmount}`)
      };

    return {
      type: 'oops'
    };
  }
}

export default EtherUtilities;
