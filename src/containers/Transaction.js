'use strict';
import React, { Component } from 'react';
import { Text, View, Linking, Image } from 'react-native';
import { TouchableCardContainer } from '../components/common';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Transaction extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.transaction.to === this.props.checksumAddress) {
      return (
        <Text>
          <Icon name="call-received" size={16} color="#7ED321" />
        </Text>
      );
    } else if (this.props.transaction.to != this.props.checksumAddress) {
      return (
        <Text>
          <Icon name="call-made" size={16} color="#D0021B" />
        </Text>
      );
    }
  }

  renderAddress() {
    if (this.props.transaction.to === this.props.checksumAddress) {
      return <Text />;
    } else if (this.props.transaction.to != this.props.checksumAddress) {
      return <Text>{this.props.transaction.to}</Text>;
    }
  }

  renderPlusOrMinusTransactionIcon() {
    if (this.props.transaction.to === this.props.checksumAddress) {
      return <Icon name="plus" size={16} color="#7ED321" />;
    } else if (this.props.transaction.to != this.props.checksumAddress) {
      return <Icon name="minus" size={16} color="#D0021B" />;
    }
  }

  renderRoundedValue() {
    const roundedEthValue = parseFloat(this.props.transaction.value).toFixed(4);
    return <Text>{roundedEthValue} ETH</Text>;
  }

  renderStatus() {
    if (this.props.transaction.state === 'sent') {
      return <Text>sent</Text>;
      return <Text>pending...</Text>;
    } else if (this.props.transaction.status >= 1 <= 11) {
      return <Text>included</Text>;
    } else if (this.props.transaction.status > 12) {
      return <Text>success!</Text>;
    }
      return <Text>failed</Text>;
  }

  render() {
    const { time } = this.props.transaction;
    const { TransactionListStyle, WalletStyleMiddleContainer, textStyle } = styles;

    return (
      <TouchableCardContainer
        alignItems="center"
        flexDirection="row"
        height="96px"
        justifyContent="center"
        textAlign="left"
        width="95%"
      >
        <View style={TransactionListStyle}>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>
            {this.renderInOrOutTransactionIcon()}
          </Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{this.renderAddress()}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{time}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{this.renderStatus()}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>
            {this.renderPlusOrMinusTransactionIcon()}
          </Text>
          <Text>{this.renderRoundedValue()}</Text>
        </View>
      </TouchableCardContainer>
    );
  }
}

const styles = {
  TransactionListStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  WalletStyleMiddleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 16
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const mapStateToProps = state => ({
    web3: state.ReducerWeb3.web3
  });
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,

export default connect(mapStateToProps)(Transaction);
