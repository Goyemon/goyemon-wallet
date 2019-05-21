'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { Button } from '../components/common/';
import { getGasPrice } from "../actions/ActionGasPrice";
import styled from 'styled-components';

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
    const { transactions, navigation } = this.props;
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
          <Text>Transaction History</Text>
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
  WalletStyleMiddleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

const CardContainerWithoutFeedback = styled.View`
  background: #FFF;
  height: 200px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

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
