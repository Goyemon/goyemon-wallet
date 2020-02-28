'use strict';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import Transaction from './Transaction';

import TxStorage from '../lib/tx.js';

class Transactions extends Component {
  constructor(props) {
    super(props);
  }

  renderTransactions() {
    const transactions = this.props.transactions ? this.props.transactions : [];
    //const transactions = await TxStorage.storage.tempGetAllAsList();

    if (transactions.length == 0)
      return (
        <EmptyTransactionContainer>
          <EmptyTransactionEmoji>(°△°) b</EmptyTransactionEmoji>
          <EmptyTransactionText>holy tabula rasa!</EmptyTransactionText>
          <EmptyTransactionText> you don’t have any transactions yet!</EmptyTransactionText>
        </EmptyTransactionContainer>
      );
    else
      return (
        <FlatList
          data={transactions}
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

/*
const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

export default connect(mapStateToProps)(Transactions);
*/
export default TxStorage.storage.wrap(Transactions, 'transactions');
