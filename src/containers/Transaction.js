'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { UntouchableCardContainer, CrypterestText } from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3 from 'web3';

class Transaction extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.transaction.to === null) {
      return (
        <CrypterestText>
          <Icon name="call-made" size={16} color="#D0021B" />
        </CrypterestText>
      );
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return (
        <CrypterestText>
          <Icon name="call-received" size={16} color="#7ED321" />
        </CrypterestText>
      );
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return (
        <CrypterestText>
          <Icon name="call-made" size={16} color="#D0021B" />
        </CrypterestText>
      );
    }
  }

  renderStatus() {
    if (this.props.transaction.state === 'pending') {
      return <CrypterestText>pending...</CrypterestText>;
    } else if (this.props.transaction.state === 'included') {
      return <CrypterestText>included</CrypterestText>;
    } else if (this.props.transaction.state === 'confirmed') {
      return <CrypterestText>confirmed</CrypterestText>;
    }
  }

  renderDirection() {
    if (this.props.transaction.to === null) {
      return <CrypterestText>Outgoing</CrypterestText>;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <CrypterestText>Incoming</CrypterestText>;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <CrypterestText>Outgoing</CrypterestText>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.props.transaction.to === null) {
      return ;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <Icon name="plus" size={16} color="#7ED321" />;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <Icon name="minus" size={16} color="#D0021B" />;
    }
  }

  renderRoundedValue() {
    const roundedEthValue = parseFloat(this.props.transaction.value).toFixed(4);
    if (this.props.transaction.to === null) {
      return <CrypterestText>Contract Creation</CrypterestText>;;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.to) === this.props.checksumAddress) {
      return <CrypterestText style={styles.valueStyleGreen}>{roundedEthValue} ETH</CrypterestText>;
    } else if (Web3.utils.toChecksumAddress(this.props.transaction.from) === this.props.checksumAddress) {
      return <CrypterestText style={styles.valueStyleRed}>{roundedEthValue} ETH</CrypterestText>;
    }
  }

  render() {
    let { time } = this.props.transaction;
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
        width="95%"
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
            <CrypterestText>{this.renderRoundedValue()}</CrypterestText>
          </ValueText>
        </TransactionList>
      </UntouchableCardContainer>
    );
  }
}

const styles = {
  valueStyleRed: {
    color: '#D0021B'
  },
  valueStyleGreen: {
    color: '#7ED321'
  }
};

const TransactionList = styled.View`
  flex: 1;
  flexDirection: row;
  justifyContent: center;
`;

const DirectionText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-bottom: 4px;
  margin-left: 16px;
`;

const TimeText = styled.Text`
  color: #5F5F5F;
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

export default connect(mapStateToProps)(Transaction);
