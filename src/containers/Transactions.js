'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import {
  addPendingTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import firebase from 'react-native-firebase';

class Transactions extends Component {
  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(downstreamMessage => {
      if (downstreamMessage.data.type === 'txstate' && downstreamMessage.data.state === 'pending') {
        this.props.addPendingTransaction(downstreamMessage.data);
      } else if (downstreamMessage.data.type === 'txstate' && downstreamMessage.data.state === 'included') {
        this.props.transactions.map(transaction => {
          if( transaction.hash === downstreamMessage.data.txhash ){
            this.props.updateTransactionState(downstreamMessage.data);
          }
        });
      } else if (downstreamMessage.data.type === 'txstate' && downstreamMessage.data.state === 'confirmed') {
        this.props.transactions.map(transaction => {
          if(transaction.hash === downstreamMessage.data.txhash){
            this.props.updateTransactionState(downstreamMessage.data);
          }
        });
      }
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

  renderTransactions(){
    const { transactions } = this.props;
    if(transactions) {
      return (
        <View>
          {transactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </View>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderTransactions()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

const mapDispatchToProps = {
  addPendingTransaction,
  updateTransactionState
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
