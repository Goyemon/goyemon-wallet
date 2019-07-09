'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { RootContainer, Button, HeaderOne, HeaderTwo } from '../components/common/';
import { getGasPrice } from '../actions/ActionGasPrice';
import { getExistingTransactions } from '../actions/ActionTransactions';
import styled from 'styled-components';

class Ethereum extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: '0.0',
      usdBalance: '0.0'
    };
  }

  async componentDidMount() {
    const balanceInWei = await this.getBalance(this.props.checksumAddress);
    const balanceInEther = this.props.web3.utils.fromWei(balanceInWei);
    const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
    await this.props.getExistingTransactions('1b5e2011e26B3051E4ad1936299c417eEDaCBF50');
    this.setState({ balance: roundedBalanceInEther });
    this.setState({ usdBalance: this.getUsdBalance() });
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch (err) {
      console.error(err);
    }
  }

  getUsdBalance() {
    try {
      const usdPrice = this.props.wallets[0].price;
      const ethBalance = parseFloat(this.state.balance);
      const usdBalance = usdPrice * ethBalance;
      const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedUsdBalance;
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { transactions, navigation } = this.props;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <RootContainer>
        <HeaderOne>Ethereum</HeaderOne>
        <CardContainerWithoutFeedback>
          <HeaderTwo fontSize="24px">Total Balance</HeaderTwo>
          <UsdBalance>${this.state.usdBalance}</UsdBalance>
          <EthBalance>{this.state.balance} ETH</EthBalance>
          <ButtonContainer>
            <Button
              text="Receive"
              textColor="white"
              backgroundColor="#39C89E"
              margin="8px"
              onPress={() => navigation.navigate('Receive')}
            />
            <Button
              text="Send"
              textColor="white"
              backgroundColor="#39C89E"
              margin="8px"
              onPress={async () => {
                await this.props.getGasPrice();
                navigation.navigate('Send');
              }}
            />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
        <View>
          <HeaderTwo fontSize="16px">Transaction History</HeaderTwo>
        </View>
        <Transactions />
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  height: 240px;
  margin-top: 24px;
  padding: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const EthBalance = styled.Text`
  font-size: 16px;
`;

const mapStateToProps = state => ({
    transactions: state.ReducerTransactionHistory.transactions,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    web3: state.ReducerWeb3.web3,
    wallets: state.ReducerWallets.wallets
  });

const mapDispatchToProps = {
  getGasPrice,
  getExistingTransactions
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Ethereum)
);
