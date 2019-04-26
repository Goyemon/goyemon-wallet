'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { Button } from '../components/common/Button';

const Ethereum = ({ transactions, navigation }) => {
  const { textStyle, TransactionListStyle, WalletStyleMiddleContainer } = styles;
    return (
      <ScrollView>
        <View>
        <View style={textStyle}>
          <Text>0 ETH</Text>
        </View>
        <View>
          <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={() => navigation.navigate('Send')} />
        </View>
        <View>
          <Button text="Receive" textColor="white" backgroundColor="grey" onPress={() => navigation.navigate('Receive')} />
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
