'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import { TouchableCardContainer } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

import TxStorage from '../lib/tx.js';

class Transaction extends Component {
  constructor(props) {
    super(props);
    const tx = props.transaction;

    try {
      this.isDaiApproveTx = tx.hasTokenOperation('dai', TxStorage.TxTokenOpTypeToName.approval);

      const cDaiMints = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.mint);
      this.isCDaiMintTx = cDaiMints.length > 0;
      this.cDaiMintValue;
      if (this.isCDaiMintTx)
        this.cDaiMintValue = TransactionUtilities.parseHexCDaiValue(cDaiMints[0].mintUnderlying);

      const cDaiRedeems = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.redeem);
      this.isCDaiRedeemUnderlyingTx = cDaiRedeems.length > 0;
      this.cDaiRedeemValue;
      if (this.isCDaiRedeemUnderlyingTx)
        this.cDaiRedeemValue = TransactionUtilities.parseHexCDaiValue(cDaiRedeems[0].redeemUnderlying);

      const cDaiFails = tx.getTokenOperations('cdai', TxStorage.TxTokenOpTypeToName.failure);
      this.isCDaiFailedTx = cDaiFails.length > 0;
      this.isCDaiMintFailedTx;
      cDaiFails.forEach((tokenOp) => {
        this.isCDaiMintFailedTx = this.isCDaiMintFailedTx || (parseInt(tokenOp.error, 16) === 38);
      });

      this.isCDaiRedeemUnderlyingFailedTx = false;
      cDaiFails.forEach((tokenOp) => {
        const errNum = parseInt(tokenOp.error, 16);
        this.isCDaiRedeemUnderlyingFailedTx = this.isCDaiRedeemUnderlyingFailedTx || errNum == 42 || errNum == 45;
      });

      const ameTrs = tx.getTokenOperations('ame_ropsten', TxStorage.TxTokenOpTypeToName.transfer);
      this.isAmeTransferTx = ameTrs.length > 0;
      this.isOutgoingAmeTx;
      this.isIncomingAmeTx;
      this.ameTransferValue;
      if (this.isAmeTransferTx) {
        this.ameTransferValue = TransactionUtilities.parseHexDaiValue(ameTrs[0].amount);
        this.isOutgoingAmeTx = ameTrs.some((x) => Web3.utils.toChecksumAddress(x.from_addr) === props.checksumAddress);
        this.isIncomingAmeTx = ameTrs.some((x) => Web3.utils.toChecksumAddress(x.to_addr) === props.checksumAddress);
      }

      const daiTrs = tx.getTokenOperations('dai', TxStorage.TxTokenOpTypeToName.transfer);
      this.isDaiTransferTx = daiTrs.length > 0;
      this.isOutgoingDaiTx;
      this.isIncomingDaiTx;
      this.daiTransferValue;
      if (this.isDaiTransferTx) {
        this.daiTransferValue = TransactionUtilities.parseHexDaiValue(daiTrs[0].amount);
        this.isOutgoingDaiTx = daiTrs.some((x) => Web3.utils.toChecksumAddress(x.from_addr) === props.checksumAddress);
        this.isIncomingDaiTx = daiTrs.some((x) => Web3.utils.toChecksumAddress(x.to_addr) === props.checksumAddress);
      }

      if (this.props.transaction.getFrom() != null) {
        this.isOutgoingEthTx =
          Web3.utils.toChecksumAddress(tx.getFrom()) === props.checksumAddress;
        this.isIncomingEthTx =
          Web3.utils.toChecksumAddress(tx.getTo()) === props.checksumAddress;
      }
    }
    catch (e) {
      this.derpbugexception = `Transaction() exception: ${e.message} @ ${e.stack} || ${JSON.stringify(props.transaction)}`;
    }
  }

  renderInOrOutTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize={16}>
            <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
          </CrypterestText>
        );
      } else if (this.isOutgoingDaiTx) {
        return (
          <CrypterestText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </CrypterestText>
        );
      } else if (this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </CrypterestText>
        );
      }
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx) {
        return (
          <CrypterestText fontSize={16}>
            <Icon name="call-made" size={20} color="#F1860E" />
          </CrypterestText>
        );
      } else if (this.isIncomingAmeTx) {
        return (
          <CrypterestText fontSize={16}>
            <Icon name="call-received" size={20} color="#1BA548" />
          </CrypterestText>
        );
      }
    }

    if (this.isCDaiFailedTx) {
      return (
        <CrypterestText fontSize={16}>
          <Icon name="alert-circle-outline" size={20} color="#E41B13" />
        </CrypterestText>
      );
    }

    if (this.isDaiApproveTx || this.isCDaiMintTx) {
      return (
        <CrypterestText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      return (
        <CrypterestText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    }

    if (this.isOutgoingEthTx && this.isIncomingEthTx)
      return (
        <CrypterestText fontSize={16}>
          <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
        </CrypterestText>
      );

    if (this.props.transaction.getFrom() == null || this.isOutgoingEthTx)
      return (
        <CrypterestText fontSize={16}>
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );

    if (this.isIncomingEthTx)
      return (
        <CrypterestText fontSize={16}>
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );

  }

  renderStatus() {
    if (this.props.transaction.getState() === TxStorage.TxStates.STATE_NEW)
      return <CrypterestText fontSize={20}>sent...</CrypterestText>;
    else if (this.props.transaction.state === TxStorage.TxStates.STATE_PENDING)
      return <CrypterestText fontSize={20}>pending...</CrypterestText>;
    else if (this.props.transaction.state === TxStorage.TxStates.STATE_INCLUDED)
      return <CrypterestText fontSize={20}>included</CrypterestText>;
    else if (this.props.transaction.state === TxStorage.TxStates.STATE_CONFIRMED)
      return <CrypterestText fontSize={20}>confirmed</CrypterestText>;
    else if (this.props.transaction.state === TxStorage.TxStates.STATE_ERROR)
      return (
        <View>
          <FailedStatusText>failed</FailedStatusText>
          <FailedStatusHintText>*try syncing in the advanced settings</FailedStatusHintText>
        </View>
      );
    }
  }

  renderType() {
    let txType;
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx)
        txType = 'Self';
      else if (this.isOutgoingDaiTx)
        txType = 'Outgoing';
      else if (this.isIncomingDaiTx)
        txType = 'Incoming';

      return <CrypterestText fontSize={18}>{txType}</CrypterestText>;
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx)
        txType = 'Outgoing';
      else if (this.isIncomingAmeTx)
        txType = 'Incoming';

      return <CrypterestText fontSize={18}>{txType}</CrypterestText>;
    }

    if (this.isCDaiMintFailedTx)
      txType = 'Deposit Failed';
    else if (this.isCDaiRedeemUnderlyingFailedTx)
      txType = 'Withdraw Failed';

    if (txType)
      return <CrypterestText fontSize="14">{txType}</CrypterestText>;

    if (this.isDaiApproveTx)
      txType = 'Initiated';
    else if (this.isCDaiMintTx)
      txType = 'Deposited';
    else if (this.isCDaiRedeemUnderlyingTx)
      txType = 'Withdrawn';

    if (txType)
      return <CrypterestText fontSize={18}>{txType}</CrypterestText>;

    if (this.isOutgoingEthTx && this.isIncomingEthTx)
      txType = 'Self';
    else if (this.props.transaction.getFrom() === null || this.isOutgoingEthTx)
      txType = 'Outgoing';
    else if (this.isIncomingEthTx)
      txType = 'Incoming';

    if (txType)
      return <CrypterestText fontSize={18}>{txType}</CrypterestText>;
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx)
        return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
      else if (this.isOutgoingDaiTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.isIncomingDaiTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.isAmeTransferTx) {
      if (this.isOutgoingAmeTx)
        return <Icon name="minus" size={16} color="#F1860E" />;
      else if (this.isIncomingAmeTx)
        return <Icon name="plus" size={16} color="#1BA548" />;
    }

    if (this.isDaiApproveTx)
      return;

    if (this.isCDaiFailedTx)
      return null;

    if (this.isCDaiMintTx)
      return <Icon name="minus" size={16} color="#F1860E" />;

    if (this.isCDaiRedeemUnderlyingTx)
      return <Icon name="plus" size={16} color="#1BA548" />;


    if (this.isOutgoingEthTx && this.isIncomingEthTx)
      return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
    else if (this.props.transaction.getFrom() == null || this.isOutgoingEthTx)
      return <Icon name="minus" size={16} color="#F1860E" />;
    else if (this.isIncomingEthTx)
      return <Icon name="plus" size={16} color="#1BA548" />;
  }

  renderValue() {
    if (this.isDaiTransferTx) {
      let style;

      if (this.isOutgoingDaiTx)
        style = styles.valueStyleRed;
      else if (this.isIncomingDaiTx)
        style = styles.valueStyleGreen;

      return (
        <CrypterestText fontSize={16} style={style}>
          {this.daiTransferValue} DAI
        </CrypterestText>
      );
    }

    if (this.isAmeTransferTx) {
      let style;

      if (this.isOutgoingAmeTx) // is it possible that they're neither? both in here and for DAI this code uses else if, but should be just else imo.
        style = styles.valueStyleRed
      else if (this.isIncomingAmeTx)
          style = styles.valueStyleGreen;

      return (
        <CrypterestText fontSize={16} style={style}>
          {this.ameTransferValue} AME
        </CrypterestText>
      );
    }

    if (this.isDaiApproveTx)
      return null;

    if (this.isCDaiFailedTx)
      return <CrypterestText fontSize={16}>0</CrypterestText>;

    if (this.isCDaiMintTx)
      return (
        <CrypterestText fontSize={16} style={styles.valueStyleRed}>
          {this.cDaiMintValue} DAI
        </CrypterestText>
      );

    if (this.isCDaiRedeemUnderlyingTx)
      return (
        <CrypterestText fontSize={16} style={styles.valueStyleGreen}>
          {this.cDaiRedeemValue} DAI
        </CrypterestText>
      );

    if (this.props.transaction.getFrom() === null)
      return <CrypterestText fontSize={16}>Token Transfer</CrypterestText>;

    if (this.props.transaction.getTo() === null)
      return <CrypterestText fontSize={16}>Contract Creation</CrypterestText>;


    const roundedEthValue = parseFloat(TransactionUtilities.parseEthValue(this.props.transaction.getValue())).toFixed(4);
    if (this.isOutgoingEthTx)
      return (
        <CrypterestText fontSize={16} style={styles.valueStyleRed}>
          {roundedEthValue} ETH
        </CrypterestText>
      );
    else if (this.isIncomingEthTx)
      return (
        <CrypterestText fontSize={16} style={styles.valueStyleGreen}>
          {roundedEthValue} ETH
        </CrypterestText>
      );
  }



  render() {
    if (this.derpbugexception)
      return <CrypterestText fontSize={12}>{this.derpbugexception}</CrypterestText>;

    const time = TransactionUtilities.parseTransactionTime(this.props.transaction.getTimestamp());

    return (
      <TouchableCardContainer
        alignItems="center"
        borderRadius="0"
        flexDirection="row"
        height="96px"
        justifyContent="center"
        marginTop="0"
        textAlign="left"
        width="95%"
        onPress={() => TxStorage.storage.__addDebug(JSON.stringify(this.props.transaction)).__addDebug(JSON.stringify(Object.entries(this).map(a => a[1] instanceof Object ? [a[0], "Obj"] : a))) }>
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
            <CrypterestText fontSize={16}>{this.renderValue()}</CrypterestText>
          </ValueContainer>
        </TransactionList>
      </TouchableCardContainer>
    );
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
  width: 30%;
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
  width: 32%;
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
  width: 28%;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(Transaction);
