'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3 from 'web3';

class TransactionDai extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return (
        <CrypterestText fontSize="16px">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16px">
          <Icon name="call-received" size={20} color="#1BA548" />
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16px">
          <Icon name="call-made" size={20} color="#F1860E" />
        </CrypterestText>
      );
    }
  }

  renderStatus() {
    if (this.props.daiTransaction.state === 'sent') {
      return <CrypterestText fontSize="20px">sent...</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'pending') {
      return <CrypterestText fontSize="20px">pending...</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'included') {
      return <CrypterestText fontSize="20px">included</CrypterestText>;
    } else if (this.props.daiTransaction.state === 'confirmed') {
      return <CrypterestText fontSize="20px">confirmed</CrypterestText>;
    }
  }

  renderDirection() {
    if (this.props.daiTransaction.ame_ropsten.to === null) {
      return <CrypterestText fontSize="16px">Outgoing</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return <CrypterestText fontSize="16px">Incoming</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return <CrypterestText fontSize="16px">Outgoing</CrypterestText>;
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
      return <CrypterestText fontSize="16px">Contract Creation</CrypterestText>;
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.to) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16px" style={styles.valueStyleGreen}>
          {ameValue} AME
        </CrypterestText>
      );
    } else if (
      Web3.utils.toChecksumAddress(this.props.daiTransaction.ame_ropsten.from) ===
      this.props.checksumAddress
    ) {
      return (
        <CrypterestText fontSize="16px" style={styles.valueStyleRed}>
          {ameValue} AME
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
        justifyContent="center"
        marginTop="0"
        textAlign="left"
        width="90%"
      >
        <TransactionList>
          {this.renderInOrOutTransactionIcon()}
          <View>
            <DirectionText>{this.renderDirection()}</DirectionText>
            <TimeText>{time}</TimeText>
          </View>
          <StatusText>{this.renderStatus()}</StatusText>
          <ValueText>
            {this.renderPlusOrMinusTransactionIcon()}
            <CrypterestText fontSize="16px">{this.renderValue()}</CrypterestText>
          </ValueText>
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
`;

const DirectionText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-bottom: 4px;
  margin-left: 16px;
`;

const TimeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  margin-left: 16px;
`;

const StatusText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-left: 16px;
`;

const ValueText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-left: 16px;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

export default connect(mapStateToProps)(TransactionDai);
