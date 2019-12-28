'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';

class Transactions extends Component {
  renderTransactions() {
    const { transactions } = this.props;

    if (transactions === null || transactions.length === 0) {
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
          <EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
          <EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
        </EmptyTransactionContainer>
      );
    } else if (transactions.length > 0) {
      return (
        <FlatList
          data={transactions}
          renderItem={({ item }) => <Transaction transaction={item} />}
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
  font-size: 40;
  margin-bottom: 24px;
`;

const EmptyTransactionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

export default connect(mapStateToProps)(Transactions);
