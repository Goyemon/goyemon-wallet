'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text, Button } from 'react-native';
import Transactions from '../containers/Transactions';

const Ethereum = ({ transactions, navigation }) => {
  const { textStyle, TransactionListStyle, WalletStyleMiddleContainer } = styles;
    return (
      <ScrollView>
        <View>
        <View style={textStyle}>
          <Text>0 ETH</Text>
        </View>
        <View>
          <Button
            title="Send"
            onPress={() => navigation.navigate('Send')}
          />
        </View>
        <View>
          <Button
            title="Receive"
            onPress={() => navigation.navigate('Receive')}
          />
        </View>
        </View>
        <View style={TransactionListStyle}>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>transaction id</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>status</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>amount</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>to</Text>
          <Text style={[WalletStyleMiddleContainer, textStyle]}>date</Text>
        </View>
        {transactions.map(transaction => (<Transactions key={transaction.id} transaction={transaction} />
        ))}
      </ScrollView>
    );
};

const styles = {
  textStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TransactionListStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  WalletStyleMiddleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

const mapStateToProps = state => {
  return { transactions: state.ReducerTransactions.transactions }
}

export default withNavigation(connect(mapStateToProps)(Ethereum));
