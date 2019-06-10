'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import Transaction from './Transaction';

class Transactions extends Component {
  render() {
    const { transactions } = this.props;
    return (
      <View>
        {transactions.map((transaction) => {
          return (
                <Transaction key={transaction.id} transaction={transaction} />
              )
          })
        }
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    transactions: state.ReducerTransactions.transactions
 }
}

export default connect(mapStateToProps)(Transactions);
