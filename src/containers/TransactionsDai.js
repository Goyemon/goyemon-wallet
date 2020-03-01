'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';
import TxStorage from '../lib/tx.js';


class TransactionsDai extends Component {
  renderTransactions() {
    const { transactions } = this.props;

    const daiTransactions = transactions? transactions.filter(tx => {
        if (tx.hasTokenOperations('dai'))
          return true;

        if (tx.hasTokenOperations('cdai'))
          return tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint) ||
            tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.redeem) ||
            tx.hasTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.failure);
    }) : [];

    if (daiTransactions.length == 0)
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
          <EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
          <EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
        </EmptyTransactionContainer>
      );

    return (
      <FlatList
        data={daiTransactions}
        renderItem={({ item }) => <Transaction transaction={item} />}
        keyExtractor={item => item.getHash()}
      />
    );

  }

  render() {
    return <View>{this.renderTransactions()}</View>;
  }
}

const EmptyTransactionContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 120px;
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

// const mapStateToProps = state => ({
//   transactions: state.ReducerTransactionHistory.transactions
// });

// export default connect(mapStateToProps)(TransactionsDai);
export default TxStorage.storage.wrap(TransactionsDai, 'transactions');
