'use strict';
import React, { Component } from 'react';
import { Text, View, Linking, Image } from 'react-native';
import { Card } from '../components/common';
import { connect } from "react-redux";
import styled from 'styled-components';

class Transaction extends Component {
  renderInOrOutTransactionIcon() {
    if (this.props.transaction.to === "0x1b5e2011e26b3051e4ad1936299c417eedacbf50") {
      return <Text>↓</Text>;
    } else if (this.props.transaction.to != "0x1b5e2011e26b3051e4ad1936299c417eedacbf50") {
      return <Text>↑</Text>;
    }
  }


  renderRoundedValue() {
    const roundedEthValue = parseFloat(this.props.transaction.value).toFixed(4);
    return <Text>{roundedEthValue} ETH</Text>
  }

  renderStatus() {
    if (this.props.transaction.status === 'pending') {
      return <Text>pending...</Text>;
    } else if (1 <= this.props.transaction.status <= 11) {
      return <Text>included</Text>;
    } else if (this.props.transaction.status > 12) {
      return <Text>success!</Text>;
    } else {
      return <Text>failed</Text>;
    }
  }

  render() {
    const { time, status, to, value } = this.props.transaction;
    const { TransactionListStyle, WalletStyleMiddleContainer, textStyle } = styles;

    return (
      <Card>
        <View style={TransactionListStyle}>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>
            {this.renderInOrOutTransactionIcon()}
          </Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{time}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{this.renderStatus()}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{to}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{value} ETH</Text>
        </View>
      </Card>
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
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const mapStateToProps = state => {
  return {
    web3: state.ReducerWeb3.web3
 }
}

export default connect(mapStateToProps)(Transaction);
