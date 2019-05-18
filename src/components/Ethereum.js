'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { Button } from '../components/common/Button';
import { getGasPrice } from "../actions/ActionGasPrice";

class Ethereum extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: "0.0",
      usdBalance: "0.0"
    };
  }

  async componentDidMount() {
    const balanceInWei = await this.getBalance(this.props.checksumAddress);
    const balanceInEther = await this.props.web3.utils.fromWei(balanceInWei, 'ether');
    await this.setState({balance: balanceInEther});
    await this.setState({usdBalance: await this.getUsdBalance()});
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch(err) {
      console.error(err);
    }
  }

  async getUsdBalance() {
    try {
      const usdPrice = this.props.wallets[0].price;
      const ethBalance = parseFloat(this.state.balance);
      const usdBalance = usdPrice * ethBalance;
      return usdBalance;
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const transactions = this.props.transactions;
    const navigation = this.props.navigation;
    const checksumAddress = this.props.checksumAddress;
    const { textStyle, TransactionListStyle, WalletStyleMiddleContainer } = styles;

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <ScrollView>
        <CardContainerWithoutFeedback>
          <Text>TOTAL BALANCE</Text>
          <Text>{this.state.balance} ETH</Text>
          <Text>{this.state.usdBalance} USD</Text>
          <Text>Address: {checksumAddress}</Text>
          <ButtonContainer>
            <Button text="Receive" textColor="white" backgroundColor="grey"
            onPress={() => navigation.navigate('Receive')} />
            <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={async () => {
              await this.props.getGasPrice();
              navigation.navigate('Send');
            }} />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
        <View>
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
  }
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
  return {
    transactions: state.ReducerTransactions.transactions,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    web3: state.ReducerWeb3.web3,
    wallets: state.ReducerWallets.wallets
}
}

const mapDispatchToProps = {
    getGasPrice
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Ethereum));
