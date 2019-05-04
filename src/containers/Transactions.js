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

  render() {
    const { id, title, completed } = this.props.transaction;
    const {
      TransactionListStyle,
      WalletStyleMiddleContainer,
      textStyle
    } = styles;
    return (
      <Card>
        <View style={TransactionListStyle}>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{id}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{title}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{title}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{title}</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>{title}</Text>
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
