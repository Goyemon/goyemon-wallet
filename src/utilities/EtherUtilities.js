'use strict';
import TransactionUtilities from './TransactionUtilities';
import TxStorage from '../lib/tx.js';

class EtherUtilities {
  static hexArrayToString(array) {
    return Buffer.from(array).toString('hex');
  }

  static getReasonablyAddress(checksumAddress) {
    const reasonablyAddress = checksumAddress.substr(0, 2) == '0x' && checksumAddress.length > 2
    ? checksumAddress.substr(2)
    : checksumAddress.length < 2
    ? '0000000000000000000000000000000000000000'
    : checksumAddress
    return reasonablyAddress.toLowerCase()
  }

  static topType(top, toptok, our_reasonably_stored_address) {
    if (
      top instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.eth2tok
        ] ||
      top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.U2swap]
    )
      return {
        type: 'swap',
        eth_sold: parseFloat(
          TransactionUtilities.parseEthValue(`0x${top.eth_sold}`)
        ).toFixed(4),
        tokens_bought: TransactionUtilities.parseHexDaiValue(
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
        amount: TransactionUtilities.parseHexDaiValue(
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
        amount: TransactionUtilities.parseHexDaiValue(`0x${top.amount}`),
        direction:
          top.from_addr === our_reasonably_stored_address
            ? top.to_addr === our_reasonably_stored_address
              ? 'self'
              : 'outgoing'
            : top.to_addr === our_reasonably_stored_address
            ? 'incoming'
            : 'unknown',
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.failure]
    )
      return {
        type: 'failure',
        failop:
          parseInt(top.info, 16) == 38
            ? 'mint'
            : Array.from([42, 45, 46]).contains(parseInt(top.info, 16))
            ? 'redeem'
            : 'unknown',
        token: toptok
      };

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
        amount: TransactionUtilities.parseHexDaiValue(
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
        amount: TransactionUtilities.parseHexDaiValue(
          `0x${top.redeemUnderlying}`
        ),
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[
        TxStorage.TxTokenOpTypeToName.PTrewarded
      ]
    )
      return {
        type: 'rewarded',
        amount: TransactionUtilities.parseHexDaiValue(`0x${top.winnings}`),
        token: toptok
      };

    if (
      top instanceof
      TxStorage.TxTokenOpNameToClass[
        TxStorage.TxTokenOpTypeToName.PTwithdrawn
      ]
    )
      return {
        type: 'withdraw',
        token: toptok,
        amount: TransactionUtilities.parseHexDaiValue(
          `0x${top.withdrawAmount}`
        )
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
        amount: TransactionUtilities.parseHexDaiValue(
          `0x${top.withdrawAmount}`
        )
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
        amount: TransactionUtilities.parseHexDaiValue(
          `0x${top.withdrawAmount}`
        )
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
        amount: TransactionUtilities.parseHexDaiValue(
          `0x${top.withdrawAmount}`
        )
      };

    return {
      type: 'oops'
    };
  }
}

export default EtherUtilities;
