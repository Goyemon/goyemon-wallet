'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import TransactionDai from './TransactionDai';

class TransactionsDai extends Component {
  renderTransactions() {
    const { transactions } = this.props;

    let daiTransactions = null;
    if (transactions != null && Object.keys(transactions).length != 0) {
      daiTransactions = transactions.filter(transaction => {
        if (
          transaction.hasOwnProperty('dai_tr') ||
          transaction.hasOwnProperty('dai_appr') ||
          transaction.hasOwnProperty('cdai_mint') ||
          transaction.hasOwnProperty('cdai_redeem')
        ) {
          return true;
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
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const EmptyTransactionEmoji = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 40;
  margin-bottom: 24;
`;

const EmptyTransactionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

export default connect(mapStateToProps)(TransactionsDai);
