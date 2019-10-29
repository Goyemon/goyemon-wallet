'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Text } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import { saveEthBalance } from '../actions/ActionBalance';
import styled from 'styled-components';
import PriceUtilities from '../utilities/PriceUtilities.js';

class WalletList extends Component {
  getTotalBalance(ethBalance, daiBalance) {
    let totalUsdBalance =
      parseFloat(PriceUtilities.convertEthToUsd(ethBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(daiBalance));
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
  web3: state.ReducerWeb3.web3,
  balance: state.ReducerBalance.balance
});

const mapDispatchToProps = {
  saveEthBalance
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WalletList)
);
