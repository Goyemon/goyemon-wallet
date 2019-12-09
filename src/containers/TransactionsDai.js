'use strict';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import TransactionDai from './TransactionDai';
import styled from 'styled-components/native';

class TransactionsDai extends Component {
  renderTransactions() {
    const { transactions } = this.props;
    let daiTransactions = null;
    if (transactions != null) {
      daiTransactions = transactions.filter(transaction => {
        if (transaction.hasOwnProperty('ame_ropsten')) {
          return transaction;
        }
      });
    }
    if (daiTransactions === null || daiTransactions.length === 0) {
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
          <EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
          <EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
        </EmptyTransactionContainer>
      );
    } else if (daiTransactions.length > 0) {
      return (
        <FlatList
          data={daiTransactions}
          renderItem={({ item }) => <TransactionDai daiTransaction={item} />}
          keyExtractor={item => item.hash}
        />
      );
    }
  }

  render() {
    return <View>{this.renderTransactions()}</View>;
  }
}

const EmptyTransactionContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const EmptyTransactionEmoji = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 40px;
  margin-bottom: 24px;
`;

const EmptyTransactionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

export default connect(mapStateToProps)(TransactionsDai);
