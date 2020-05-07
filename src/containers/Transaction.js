'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { GoyemonText, TouchableCardContainer } from '../components/common';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

/*	=======================================================
  2020-03-02 13:19:12
  TODO: this needs a lot of simplification. A litany of if()elseif()s is not easy to follow. There are much simplified logical conditions which can do that.
  Additionally, a lot of stuff just ends without returning any value potentially (no default case when none of if()s matches).
  ======================================================= */

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = { transaction: null };
  }

  recomputeAllTheWeirdoConstsAndStuff(tx) {
    const { checksumAddress } = this.props;
    let newState = {};

    if (tx instanceof TxStorage.Tx) {
      newState.transaction = tx;
      try {
        const uniswaps = tx.getTokenOperations(
          'uniswap',
          TxStorage.TxTokenOpTypeToName.eth2tok
        );
        newState.isUniswapTx = uniswaps.length > 0;
        newState.ethSold;
        newState.tokenBought;
        if (newState.isUniswapTx) {
          newState.ethSold = TransactionUtilities.parseEthValue(
            `0x${uniswaps[0].eth_sold}`
          );
          newState.tokenBought = TransactionUtilities.parseHexDaiValue(
            `0x${uniswaps[0].tok_bought}`
          );
        }

        newState.isDaiApproveTx = tx.hasTokenOperation(
          'dai',
          TxStorage.TxTokenOpTypeToName.approval
        );

        const PTdeps = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTdepositted
        );
        newState.isPTdepositTx = PTdeps.length > 0;
        newState.PTdepositValue;
        if (newState.isPTdepositTx)
          newState.PTdepositValue = TransactionUtilities.parseHexDaiValue(
            `0x${PTdeps[0].depositPoolAmount}`
          );

        const PTdepcs = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTdeposittedAndCommitted
        );
        newState.isPTdepositTx = PTdepcs.length > 0;
        newState.PTdepositValue;
        if (newState.isPTdepositTx)
          newState.PTdepositValue = TransactionUtilities.parseHexDaiValue(
            `0x${PTdepcs[0].depositPoolAmount}`
          );

        const PTspdeps = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTsponsorshipDeposited
        );
        newState.isPTdepositTx = PTspdeps.length > 0;
        newState.PTdepositValue;
        if (newState.isPTdepositTx)
          newState.PTdepositValue = TransactionUtilities.parseHexDaiValue(
            `0x${PTspdeps[0].depositPoolAmount}`
          );

        const PTwdrws = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTwithdrawn
        );
        const PTopdepwis = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTopenDepositWithdrawn
        );
        const PTspafwis = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn
        );
        const PTcodewis = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTcommittedDepositWithdrawn
        );

        newState.isPTwithdrawTx =
          PTwdrws.length > 0 ||
          PTopdepwis.length > 0 ||
          PTspafwis.length > 0 ||
          PTcodewis.length > 0;
        newState.PTwithdrawValue = 0;
        if (newState.isPTwithdrawTx) {
          if (PTwdrws.length > 0) {
            newState.PTwithdrawValue = TransactionUtilities.parseHexDaiValue(
              `0x${PTwdrws[0].withdrawAmount}`
            );
          } else if (
            PTopdepwis.length > 0 ||
            PTspafwis.length > 0 ||
            PTcodewis.length > 0
          ) {
            if (PTopdepwis[0]) {
              newState.PTwithdrawValue = new BigNumber(
                newState.PTwithdrawValue
              ).plus(PTopdepwis[0].withdrawAmount, 16);
            }
            if (PTspafwis[0]) {
              newState.PTwithdrawValue = new BigNumber(
                newState.PTwithdrawValue
              ).plus(PTspafwis[0].withdrawAmount, 16);
            }
            if (PTcodewis[0]) {
              newState.PTwithdrawValue = new BigNumber(
                newState.PTwithdrawValue
              ).plus(PTcodewis[0].withdrawAmount, 16);
            }
            newState.PTwithdrawValue = TransactionUtilities.parseHexDaiValue(
              `0x${newState.PTwithdrawValue.toString(16)}`
            );
          }
        }

        const PTrew = tx.getTokenOperations(
          'pooltogether',
          TxStorage.TxTokenOpTypeToName.PTrewarded
        );
        newState.isPTRewardTx = PTrew.length > 0;
        newState.PTrewardValue;
        if (newState.isPTRewardTx)
          newState.PTrewardValue = TransactionUtilities.parseHexDaiValue(
            `0x${PTrew[0].winnings}`
          );

        const cDaiMints = tx.getTokenOperations(
          'cdai',
          TxStorage.TxTokenOpTypeToName.mint
        );
        newState.isCDaiMintTx = cDaiMints.length > 0;
        newState.cDaiMintValue;
        if (newState.isCDaiMintTx)
          newState.cDaiMintValue = TransactionUtilities.parseHexDaiValue(
            `0x${cDaiMints[0].mintUnderlying}`
          );

        const cDaiRedeems = tx.getTokenOperations(
          'cdai',
          TxStorage.TxTokenOpTypeToName.redeem
        );
        newState.isCDaiRedeemUnderlyingTx = cDaiRedeems.length > 0;
        newState.cDaiRedeemValue;
        if (newState.isCDaiRedeemUnderlyingTx)
          newState.cDaiRedeemValue = TransactionUtilities.parseHexDaiValue(
            `0x${cDaiRedeems[0].redeemUnderlying}`
          );

        const cDaiFails = tx.getTokenOperations(
          'cdai',
          TxStorage.TxTokenOpTypeToName.failure
        );
        newState.isCDaiFailedTx = cDaiFails.length > 0;
        newState.isCDaiMintFailedTx;
        cDaiFails.forEach((tokenOp) => {
          newState.isCDaiMintFailedTx =
            newState.isCDaiMintFailedTx || parseInt(tokenOp.info, 16) === 38;
        });

        newState.isCDaiRedeemUnderlyingFailedTx = false;
        cDaiFails.forEach((tokenOp) => {
          const failInfo = parseInt(tokenOp.info, 16);
          newState.isCDaiRedeemUnderlyingFailedTx =
            newState.isCDaiRedeemUnderlyingFailedTx ||
            failInfo == 42 ||
            failInfo == 45 ||
            failInfo == 46;
        });

        const ameTrs = tx.getTokenOperations(
          'ame_ropsten',
          TxStorage.TxTokenOpTypeToName.transfer
        );
        newState.isAmeTransferTx = ameTrs.length > 0;
        newState.isOutgoingAmeTx;
        newState.isIncomingAmeTx;
        newState.ameTransferValue;
        if (newState.isAmeTransferTx) {
          newState.ameTransferValue = TransactionUtilities.parseHexDaiValue(
            `0x${ameTrs[0].amount}`
          );
          newState.isOutgoingAmeTx = ameTrs.some(
            (x) => Web3.utils.toChecksumAddress(x.from_addr) === checksumAddress
          );
          newState.isIncomingAmeTx = ameTrs.some(
            (x) => Web3.utils.toChecksumAddress(x.to_addr) === checksumAddress
          );
        }

        const daiTrs = tx.getTokenOperations(
          'dai',
          TxStorage.TxTokenOpTypeToName.transfer
        );
        newState.isDaiTransferTx = daiTrs.length > 0;
        newState.isOutgoingDaiTx;
        newState.isIncomingDaiTx;
        newState.daiTransferValue;
        if (newState.isDaiTransferTx) {
          newState.daiTransferValue = TransactionUtilities.parseHexDaiValue(
            `0x${daiTrs[0].amount}`
          );
          newState.isOutgoingDaiTx = daiTrs.some(
            (x) => Web3.utils.toChecksumAddress(x.from_addr) === checksumAddress
          );
          newState.isIncomingDaiTx = daiTrs.some(
            (x) => Web3.utils.toChecksumAddress(x.to_addr) === checksumAddress
          );
        }

        if (tx.getFrom() != null && tx.getTo() != null) {
          newState.isOutgoingEthTx =
            Web3.utils.toChecksumAddress(tx.getFrom()) === checksumAddress;
          newState.isIncomingEthTx =
            Web3.utils.toChecksumAddress(tx.getTo()) === checksumAddress;
        }
      } catch (e) {
        newState.derpbugexception = `Transaction() exception: ${e.message} @ ${
          e.stack
        } || ${JSON.stringify(tx)}`;
      }
    } else {
      newState.transaction = null;
      // LogUtilities.toDebugScreen(tx);
      // TxStorage.storage.getTx(tx.getFrom(), tx.filter).then(x => this.recomputeAllTheWeirdoConstsAndStuff(x));
    }

    this.setState(newState);
  }

  componentDidMount() {
    // LogUtilities.toDebugScreen(this.state.transaction);
    TxStorage.storage
      .getTx(this.props.transaction.index, this.props.transaction.filter)
      .then((x) => this.recomputeAllTheWeirdoConstsAndStuff(x));
  }

  componentWillUnmount() {}

  componentDidUpdate(prevProps) {
    if (this.props.updateCounter !== prevProps.updateCounter)
      TxStorage.storage
        .getTx(this.props.transaction.index, this.props.transaction.filter)
        .then((x) => this.recomputeAllTheWeirdoConstsAndStuff(x));
  }

  renderInOrOutTransactionIcon() {
    if (this.state.isUniswapTx) {
      return (
        <GoyemonText fontSize={16}>
          <Icon name="swap-horizontal" size={20} color="#5F5F5F" />
        </GoyemonText>
      );
    }

    if (
      this.state.isDaiApproveTx ||
      this.state.isCDaiMintTx ||
      this.state.isPTdepositTx
    )
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </GoyemonText>
      );

    if (
      this.state.isCDaiRedeemUnderlyingTx ||
      this.state.isPTwithdrawTx ||
      this.state.isPTRewardTx
    )
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </GoyemonText>
      );

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
          </GoyemonText>
        );
      else if (this.state.isOutgoingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </GoyemonText>
        );
      else if (this.state.isIncomingDaiTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </GoyemonText>
        );
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </GoyemonText>
        );
      else if (this.state.isIncomingAmeTx)
        return (
          <GoyemonText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </GoyemonText>
        );
    }

    if (this.state.isCDaiFailedTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="alert-circle-outline" size={20} color="#E41B13" />
        </GoyemonText>
      );

    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
        </GoyemonText>
      );

    if (this.state.transaction.getFrom() == null || this.state.isOutgoingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </GoyemonText>
      );

    if (this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </GoyemonText>
      );
  }

  renderStatus() {
    let text;

    switch (this.state.transaction.getState()) {
      case TxStorage.TxStates.STATE_NEW:
        text = I18n.t('history-pending') + '...';
        break;

      case TxStorage.TxStates.STATE_PENDING:
        text = I18n.t('history-pending') + '...';
        break;

      case TxStorage.TxStates.STATE_INCLUDED:
        text = I18n.t('history-success');
        break;

      case TxStorage.TxStates.STATE_CONFIRMED:
        text = I18n.t('history-success');
        break;

      case TxStorage.TxStates.STATE_ERROR:
        return (
          <View>
            <FailedStatusText>{I18n.t('history-failed')}</FailedStatusText>
            <FailedStatusHintText>
              *try syncing in the advanced settings
            </FailedStatusHintText>
          </View>
        );

      default:
      // TODO: exception?
    }

    return <GoyemonText fontSize={18}>{text}</GoyemonText>;
  }

  renderType() {
    let txType;
    if (this.state.isDaiApproveTx) txType = I18n.t('history-approve');
    else if (this.state.isCDaiMintTx || this.state.isPTdepositTx)
      txType = I18n.t('deposit');
    else if (this.state.isCDaiRedeemUnderlyingTx || this.state.isPTwithdrawTx)
      txType = I18n.t('withdraw');
    else if (this.state.isPTRewardTx) txType = 'Rewarded';

    if (this.state.isUniswapTx) {
      txType = I18n.t('history-swap');
      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        txType = 'Self';
      else if (this.state.isOutgoingDaiTx) txType = I18n.t('history-outgoing');
      else if (this.state.isIncomingDaiTx) txType = I18n.t('history-incoming');

      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx) txType = I18n.t('history-outgoing');
      else if (this.state.isIncomingAmeTx) txType = I18n.t('history-incoming');

      return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
    }

    if (this.state.isCDaiMintFailedTx)
      txType = I18n.t('deposit') + ' ' + I18n.t('history-failed');
    else if (this.state.isCDaiRedeemUnderlyingFailedTx)
      txType = I18n.t('withdraw') + ' ' + I18n.t('history-failed');

    if (txType) return <GoyemonText fontSize="14">{txType}</GoyemonText>;

    if (txType) return <GoyemonText fontSize={18}>{txType}</GoyemonText>;

    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      txType = 'Self';
    else if (
      this.state.transaction.getFrom() === null ||
      this.state.isOutgoingEthTx
    )
      txType = I18n.t('history-outgoing');
    else if (this.state.isIncomingEthTx) txType = I18n.t('history-incoming');

    if (txType) return <GoyemonText fontSize={18}>{txType}</GoyemonText>;
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.state.isCDaiFailedTx) return null;

    if (this.state.isCDaiMintTx || this.state.isPTdepositTx)
      return <Icon name="minus" size={16} color="#F1860E" />;

    if (
      this.state.isCDaiRedeemUnderlyingTx ||
      this.state.isPTwithdrawTx ||
      this.state.isPTRewardTx
    )
      return <Icon name="plus" size={16} color="#1BA548" />;

    if (this.state.isUniswapTx) {
      return null;
    }

    if (this.state.isDaiTransferTx) {
      if (this.state.isOutgoingDaiTx && this.state.isIncomingDaiTx)
        return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
      else if (this.state.isOutgoingDaiTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.state.isIncomingDaiTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.state.isAmeTransferTx) {
      if (this.state.isOutgoingAmeTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.state.isIncomingAmeTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.state.isDaiApproveTx) return;

    if (this.state.isOutgoingEthTx && this.state.isIncomingEthTx)
      return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
    else if (
      this.state.transaction.getFrom() == null ||
      this.state.isOutgoingEthTx
    )
      return <Icon name="minus" size={16} color="#F1860E" />;
    else if (this.state.isIncomingEthTx)
      return <Icon name="plus" size={16} color="#1BA548" />;
  }

  renderValue() {
    if (this.state.isCDaiFailedTx)
      return <GoyemonText fontSize={16}>0</GoyemonText>;

    if (this.state.isCDaiMintTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {this.state.cDaiMintValue} DAI
        </GoyemonText>
      );

    if (this.state.isCDaiRedeemUnderlyingTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {this.state.cDaiRedeemValue} DAI
        </GoyemonText>
      );

    if (this.state.isPTdepositTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {this.state.PTdepositValue} DAI
        </GoyemonText>
      );

    if (this.state.isPTwithdrawTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {this.state.PTwithdrawValue} DAI
        </GoyemonText>
      );

    if (this.state.isPTRewardTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {this.state.PTRewardValue} DAI
        </GoyemonText>
      );

    if (this.state.isUniswapTx) {
      const uniswaps = this.state.transaction.getTokenOperations(
        'uniswap',
        TxStorage.TxTokenOpTypeToName.eth2tok
      );
      this.state.tokenBought = TransactionUtilities.parseHexDaiValue(
        `0x${uniswaps[0].tok_bought}`
      );

      let style;
      style = styles.valueStyleGreen;
      const roundedEthValue = parseFloat(this.state.ethSold).toFixed(4);

      return (
        <SwapValueContainer>
          <SwapValueTextContainer>
            <Icon name="minus" size={16} color="#F1860E" />
            <GoyemonText fontSize={16} style={style}>
              {roundedEthValue} ETH
            </GoyemonText>
          </SwapValueTextContainer>
          <Icon name="swap-vertical" size={16} color="#1BA548" />
          <SwapValueTextContainer>
            <Icon name="plus" size={16} color="#1BA548" />
            <GoyemonText fontSize={16} style={style}>
              {this.state.tokenBought} DAI
            </GoyemonText>
          </SwapValueTextContainer>
        </SwapValueContainer>
      );
    }

    if (this.state.isDaiTransferTx) {
      let style;

      if (this.state.isOutgoingDaiTx) style = styles.valueStyleRed;
      else if (this.state.isIncomingDaiTx) style = styles.valueStyleGreen;

      return (
        <GoyemonText fontSize={16} style={style}>
          {this.state.daiTransferValue} DAI
        </GoyemonText>
      );
    }

    if (this.state.isAmeTransferTx) {
      let style;

      if (this.state.isOutgoingAmeTx)
        // is it possible that they're neither? both in here and for DAI this code uses else if, but should be just else imo.
        style = styles.valueStyleRed;
      else if (this.state.isIncomingAmeTx) style = styles.valueStyleGreen;

      return (
        <GoyemonText fontSize={16} style={style}>
          {this.state.ameTransferValue} AME
        </GoyemonText>
      );
    }

    if (this.state.isDaiApproveTx) return null;

    if (this.state.transaction.getFrom() === null)
      return <GoyemonText fontSize={16}>Token Transfer</GoyemonText>;

    if (this.state.transaction.getTo() === null)
      return <GoyemonText fontSize={16}>Contract Creation</GoyemonText>;

    const roundedEthValue = parseFloat(
      TransactionUtilities.parseEthValue(
        `0x${this.state.transaction.getValue()}`
      )
    ).toFixed(4);
    if (this.state.isOutgoingEthTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleRed}>
          {roundedEthValue} ETH
        </GoyemonText>
      );
    else if (this.state.isIncomingEthTx)
      return (
        <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
          {roundedEthValue} ETH
        </GoyemonText>
      );
  }

  render() {
    if (this.state.derpbugexception)
      return (
        <GoyemonText fontSize={12}>{this.state.derpbugexception}</GoyemonText>
      );

    if (!(this.state.transaction instanceof TxStorage.Tx))
      return <GoyemonText fontSize={12}>...</GoyemonText>; // TODO: this likely needs to be, well, something else.

    try {
      const time = TransactionUtilities.parseTransactionTime(
        this.state.transaction.getTimestamp()
      );

      return (
        <TouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="row"
          height="80px"
          justifyContent="center"
          marginTop="0"
          textAlign="left"
          width="90%"
          onPress={() => LogUtilities.dumpObject('tx', this.state.transaction)}
        >
          <TransactionList>
            <InOrOutTransactionContainer>
              {this.renderInOrOutTransactionIcon()}
            </InOrOutTransactionContainer>
            <TypeTimeContainer>
              <Type>{this.renderType()}</Type>
              <Time>{time}</Time>
            </TypeTimeContainer>
            <StatusContainer>{this.renderStatus()}</StatusContainer>
            <ValueContainer>
              {this.renderPlusOrMinusTransactionIcon()}
              <View>{this.renderValue()}</View>
            </ValueContainer>
          </TransactionList>
        </TouchableCardContainer>
      );
    } catch (e) {
      const exc = `Transaction render() exception: ${e.message} @ ${
        e.stack
      } || ${JSON.stringify(this.transaction)}`;
      return <GoyemonText fontSize={12}>{exc}</GoyemonText>;
    }
  }
}

const styles = {
  valueStyleRed: {
    color: '#F1860E'
  },
  valueStyleGreen: {
    color: '#1BA548'
  }
};

const TransactionList = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const InOrOutTransactionContainer = styled.View`
  width: 10%;
`;

const TypeTimeContainer = styled.View`
  width: 32%;
`;

const Type = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 4;
`;

const Time = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const StatusContainer = styled.View`
  width: 26%;
`;

const FailedStatusText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const FailedStatusHintText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 32%;
`;

const SwapValueContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const SwapValueTextContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const mapStateToProps = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(Transaction);
