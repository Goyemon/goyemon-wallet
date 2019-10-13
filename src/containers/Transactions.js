'use strict';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import {
  addPendingTransaction,
  updateTransactionState
} from '../actions/ActionTransactionHistory';
import styled from 'styled-components/native';
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
    if(transactions.length > 0) {
      return (
        <FlatList
          data={transactions}
          renderItem={({item}) => (
            <Transaction transaction={item} />
          )}
          keyExtractor={item => item.hash}
        >
        </FlatList>
      )
    } else {
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
          <EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
          <EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
        </EmptyTransactionContainer>
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

const EmptyTransactionContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const EmptyTransactionEmoji = styled.Text`
  font-size: 40px;
  margin-bottom: 24px;
`;

const EmptyTransactionText = styled.Text`
  font-size: 16px;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

const mapDispatchToProps = {
  addPendingTransaction,
  updateTransactionState
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
