'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class TransactionDai extends Component {
  constructor(props) {
    super(props);
    this.isDaiTransferTx = props.daiTransaction.hasOwnProperty('dai_tr');
    this.isDaiApproveTx = props.daiTransaction.hasOwnProperty('dai_appr');
    this.isCDaiMintTx = props.daiTransaction.hasOwnProperty('cdai_mint');
    this.isCDaiRedeemUnderlyingTx = props.daiTransaction.hasOwnProperty('cdai_redeem');
    this.isOutgoingDaiTx;
    this.isIncomingDaiTx;
    if (props.daiTransaction.hasOwnProperty('dai_tr')) {
      this.isOutgoingDaiTx =
        Web3.utils.toChecksumAddress(props.daiTransaction.dai_tr.from) === props.checksumAddress;
      this.isIncomingDaiTx =
        Web3.utils.toChecksumAddress(props.daiTransaction.dai_tr.to) === props.checksumAddress;
    }
  }

  renderInOrOutTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
          </CrypterestText>
        );
      } else if (this.isOutgoingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-made" size={20} color="#F1860E" />
          </CrypterestText>
        );
      } else if (this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16">
            <Icon name="call-received" size={20} color="#1BA548" />
          </CrypterestText>
        );
      }
    }

    if (this.isDaiApproveTx || this.isCDaiMintTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    }
  }

  renderStatus() {
    if (this.props.daiTransaction.state === 'sent') {
      return <CrypterestText fontSize="20">sent...</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'pending') {
      return <CrypterestText fontSize="20">pending...</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'included') {
      return <CrypterestText fontSize="20">included</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'confirmed') {
      return <CrypterestText fontSize="20">confirmed</CrypterestText>;
    }
  }

  renderDirection() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return <CrypterestText fontSize="16">Self</CrypterestText>;
      } else if (this.isOutgoingDaiTx) {
        return <CrypterestText fontSize="16">Outgoing</CrypterestText>;
      } else if (this.isIncomingDaiTx) {
        return <CrypterestText fontSize="16">Incoming</CrypterestText>;
      }
    }
    if (this.isDaiApproveTx) {
      return <CrypterestText fontSize="16">Approved</CrypterestText>;
    } else if (this.isCDaiMintTx) {
      return <CrypterestText fontSize="16">Deposited</CrypterestText>;
    } else if (this.isCDaiRedeemUnderlyingTx) {
      return <CrypterestText fontSize="16">Withdrawn</CrypterestText>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return <Icon name="plus-minus" size={16} color="#5F5F5F" />;
      } else if (this.isOutgoingDaiTx) {
        return <Icon name="minus" size={16} color="#F1860E" />;
      } else if (this.isIncomingDaiTx) {
        return <Icon name="plus" size={16} color="#1BA548" />;
      }
    }

    if (this.isDaiApproveTx) {
      return;
    }

    if (this.isCDaiMintTx) {
      return <Icon name="minus" size={16} color="#F1860E" />;
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      return <Icon name="plus" size={16} color="#1BA548" />;
    }
  }

  renderValue() {
    if (this.isDaiTransferTx) {
      let daiValue;
      if (!this.props.daiTransaction.dai_tr.value) {
        daiValue = 0;
      }
      daiValue = this.props.daiTransaction.dai_tr.value;
      if (this.isOutgoingDaiTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleRed}>
            {daiValue} DAI
          </CrypterestText>
        );
      } else if (this.isIncomingDaiTx) {
        return (
          <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
            {daiValue} DAI
          </CrypterestText>
        );
      }
    }

    if (this.isDaiApproveTx) {
      return <CrypterestText fontSize="16">Approve</CrypterestText>;
    }

    if (this.isCDaiMintTx) {
      let mintDaiValue;
      if (!this.props.daiTransaction.cdai_mint.daiDeposited) {
        mintDaiValue = 0;
      }
      mintDaiValue = this.props.daiTransaction.cdai_mint.daiDeposited;

      return (
        <CrypterestText fontSize="16" style={styles.valueStyleRed}>
          {mintDaiValue} DAI
        </CrypterestText>
      );
    }

    if (this.isCDaiRedeemUnderlyingTx) {
      let daiRedeemValue;
      if (!this.props.daiTransaction.cdai_redeem.daiWithdrawn) {
        daiRedeemValue = 0;
      }
      daiRedeemValue = this.props.daiTransaction.cdai_redeem.daiWithdrawn;

      return (
        <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
          {daiRedeemValue} DAI
        </CrypterestText>
      );
    }
  }

  render() {
    let { time } = this.props.daiTransaction;
    time = TransactionUtilities.parseTransactionTime(time);

    return (
      <UntouchableCardContainer
        alignItems="center"
        borderRadius="0"
        flexDirection="row"
        height="96px"
        justifyContent="space-around"
        marginTop="0"
        textAlign="left"
        width="95%"
      >
        <TransactionList>
          <InOrOutTransactionContainer>
            {this.renderInOrOutTransactionIcon()}
          </InOrOutTransactionContainer>
          <DirectionTimeContainer>
            <Direction>{this.renderDirection()}</Direction>
            <Time>{time}</Time>
          </DirectionTimeContainer>
          <StatusContainer>{this.renderStatus()}</StatusContainer>
          <ValueContainer>
            {this.renderPlusOrMinusTransactionIcon()}
            <CrypterestText fontSize="16">{this.renderValue()}</CrypterestText>
          </ValueContainer>
        </TransactionList>
      </UntouchableCardContainer>
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

const DirectionTimeContainer = styled.View`
  width: 30%;
`;

const Direction = styled.Text`
  margin-bottom: 4;
`;

const Time = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const StatusContainer = styled.View`
  width: 35%;
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  width: 25%;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(TransactionDai);
