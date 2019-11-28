'use strict';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import styled from 'styled-components/native';

class Transactions extends Component {
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
  color: #5F5F5F;
  font-size: 40px;
  margin-bottom: 24px;
`;

const EmptyTransactionText = styled.Text`
  color: #5F5F5F;
  font-size: 16px;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions
});

export default connect(mapStateToProps)(Transactions);
