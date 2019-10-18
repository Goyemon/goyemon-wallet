'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Text } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import { saveEthBalance } from '../actions/ActionBalance';
import styled from 'styled-components';
import firebase from 'react-native-firebase';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import { saveExistingTransactions } from '../actions/ActionTransactionHistory';
import PriceUtilities from '../utilities/PriceUtilities.js';

class WalletList extends Component {
  async componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(downstreamMessage => {
      if (downstreamMessage.data.type === 'balance') {
        const balanceInWei = downstreamMessage.data.balance;
        const balanceInEther = this.props.web3.utils.fromWei(balanceInWei);
        const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
        this.props.saveEthBalance(roundedBalanceInEther);
      }
    });

    this.messageListener = firebase.messaging().onMessage(downstreamMessage => {
      if (downstreamMessage.data.type === 'txhistory' && downstreamMessage.data.count != '0') {
        const transactions = JSON.parse(downstreamMessage.data.items);
        this.props.saveExistingTransactions(transactions);
      }
    });

    await this.props.getEthPrice();
    await this.props.getDaiPrice();
  }

  componentWillUnmount() {
    this.messageListener();
  }

  getTotalBalance(ethBalance, daiBalance) {
    let totalUsdBalance = PriceUtilities.convertEthToUsd(ethBalance) + PriceUtilities.convertDaiToUsd(daiBalance);
    totalUsdBalance = parseFloat(totalUsdBalance).toFixed(2);
    return totalUsdBalance;
  }

  render() {
    const { wallets, balance, navigation } = this.props;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Home</HeaderOne>
        <CardContainerWithoutFeedback>
          <HeaderTwo color="#5F5F5F" fontSize="24px" marginBottom="8" marginLeft="0" marginTop="0">
            Total Balance
          </HeaderTwo>
          <UsdBalance>${this.getTotalBalance(balance.ethBalance, balance.daiBalance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderTwo color="#000" fontSize="16px" marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderTwo>
        {wallets.map(wallet => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="flex-start"
            textAlign="left"
            width="95%"
            key={wallet.id}
            onPress={
              wallet.coin === 'Ether'
                ? () => navigation.navigate('Ethereum')
                : () => navigation.navigate('Dai')
            }
          >
            <WalletDetail key={wallet.id} wallet={wallet} />
          </TouchableCardContainer>
        ))}
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  height: 120px;
  margin-top: 24px;
  padding: 24px;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const mapStateToProps = state => ({
    wallets: state.ReducerWallets.wallets,
    price: state.ReducerPrice.price,
    web3: state.ReducerWeb3.web3,
    balance: state.ReducerBalance.balance
  });

const mapDispatchToProps = {
  saveEthBalance,
  getEthPrice,
  getDaiPrice,
  saveExistingTransactions
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WalletList)
);
