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
    this.isCDaiFailedTx = props.daiTransaction.hasOwnProperty('cdai_failed');
    this.isCDaiMintFailedTx;
    this.isCDaiRedeemUnderlyingFailedTx;
    if(this.isCDaiFailedTx) {
      this.isCDaiMintFailedTx = props.daiTransaction.cdai_failed.failureInfo === 38;
      this.isCDaiRedeemUnderlyingFailedTx = props.daiTransaction.cdai_failed.failureInfo === 42;
    }
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

    if (this.isCDaiFailedTx) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="alert-circle-outline" size={20} color="#E41B13" />
        </CrypterestText>
      );
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
    } else if (this.props.daiTransaction.state === 'error') {
      return (
        <View>
          <FailedStatusText>failed</FailedStatusText>
          <FailedStatusHintText>*try syncing in the advanced settings</FailedStatusHintText>
        </View>
      );
    }
  }

  renderType() {
    if (this.isDaiTransferTx) {
      if (this.isOutgoingDaiTx && this.isIncomingDaiTx) {
        return <CrypterestText fontSize="18">Self</CrypterestText>;
      } else if (this.isOutgoingDaiTx) {
        return <CrypterestText fontSize="18">Outgoing</CrypterestText>;
      } else if (this.isIncomingDaiTx) {
        return <CrypterestText fontSize="18">Incoming</CrypterestText>;
      }
    }

    if (this.isCDaiMintFailedTx) {
      return <CrypterestText fontSize="14">Deposit Failed</CrypterestText>;
    } else if (this.isCDaiRedeemUnderlyingFailedTx) {
      return <CrypterestText fontSize="14">Withdraw Failed</CrypterestText>;
    }

    if (this.isDaiApproveTx) {
      return <CrypterestText fontSize="18">Approved</CrypterestText>;
    } else if (this.isCDaiMintTx) {
      return <CrypterestText fontSize="18">Deposited</CrypterestText>;
    } else if (this.isCDaiRedeemUnderlyingTx) {
      return <CrypterestText fontSize="18">Withdrawn</CrypterestText>;
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

    if (this.isCDaiFailedTx) {
      return null;
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
      return null;
    }

    if (this.isCDaiFailedTx) {
      return <CrypterestText fontSize="16">0</CrypterestText>;
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
          <TypeTimeContainer>
            <Type>{this.renderType()}</Type>
            <Time>{time}</Time>
          </TypeTimeContainer>
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

const TypeTimeContainer = styled.View`
  width: 30%;
`;

const Type = styled.Text`
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

export default connect(mapStateToProps)(TransactionDai);
