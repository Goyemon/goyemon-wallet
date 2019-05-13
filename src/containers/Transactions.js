'use strict';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from '../components/common';
import { connect } from "react-redux";
import { getTransactions } from "../actions/ActionTransactions";

class Transactions extends Component {
  componentDidMount() {
    this.props.getTransactions();
  }

  renderInOrOutTransactionIcon() {
    if(this.props.transaction.inOrOut === 0){
      return <Text>↓</Text>
    } else if(this.props.transaction.inOrOut === 1) {
      return <Text>↑</Text>
    }
  }

  renderStatus() {
    if(this.props.transaction.status === 0){
      return <Text>pending...</Text>
    } else if(this.props.transaction.status === 1) {
      return <Text>{this.props.transaction.status} confirmation</Text>
    } else {
      return <Text>{this.props.transaction.status} confirmations</Text>
    }
  }

  render() {
    const { inOrOut, date, status, to, amount } = this.props.transaction;
    const {
      TransactionListStyle,
      WalletStyleMiddleContainer,
      textStyle
    } = styles;
    return (
      <Card>
        <View style={TransactionListStyle}>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{this.renderInOrOutTransactionIcon()}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{date}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{this.renderStatus()}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{to}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{amount} ETH</Text>
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

const mapStateToProps = state => {
  return { transactions: state.ReducerTransactions.transactions }
}

const mapDispatchToProps = {
    getTransactions
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
