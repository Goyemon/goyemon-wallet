'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Web3 from 'web3';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class TransactionDai extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16">
          <Icon name="call-made" size={20} color="#F1860E" />
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
    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return <CrypterestText fontSize="16">Outgoing</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return <CrypterestText fontSize="16">Incoming</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return <CrypterestText fontSize="16">Outgoing</CrypterestText>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return <Icon name="plus" size={16} color="#1BA548" />;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return <Icon name="minus" size={16} color="#F1860E" />;
    }
  }

  renderValue() {
    let ameValue;
    if (this.props.daiTransaction.state === 'sent') {
      ameValue = this.props.daiTransaction.ame_ropsten.value / 10 ** 18;
    } else if (
      this.props.daiTransaction.state === 'pending' ||
      this.props.daiTransaction.state === 'included' ||
      this.props.daiTransaction.state === 'confirmed'
    ) {
      ameValue = this.props.daiTransaction.ame_ropsten.value / 10 ** 18;
    } else if (!this.props.daiTransaction.ame_ropsten.value) {
      ameValue = 0;
    }

    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return <CrypterestText fontSize="16">Contract Creation</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16" style={styles.valueStyleGreen}>
          {ameValue} DAI
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16" style={styles.valueStyleRed}>
          {ameValue} DAI
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
            <DirectionText>{this.renderDirection()}</DirectionText>
            <TimeText>{time}</TimeText>
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
  alignItems: center;
  flex: 1;
  flexDirection: row;
  justifyContent: space-around;
  width: 100%;
`;

const InOrOutTransactionContainer = styled.View`
  width: 10%;
`;

const DirectionTimeContainer = styled.View`
  width: 30%;
`;

const DirectionText = styled.Text`
  margin-bottom: 4px;
`;

const TimeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const StatusContainer = styled.View`
  width: 30%
`;

const ValueContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  width: 30%;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(TransactionDai);
