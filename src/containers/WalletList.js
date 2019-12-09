'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { RootContainer, QRCodeIcon, TouchableCardContainer, HeaderOne, HeaderThree } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';
import PriceUtilities from '../utilities/PriceUtilities.js';
import firebase from 'react-native-firebase';
import FcmPermissions from '../firebase/FcmPermissions.js';

class WalletList extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      headerTitle: () => <HeaderThree color="#E41B13" marginBottom="0" marginLeft="0" marginTop="16">crypterest</HeaderThree>,
      headerRight: (
        <QRCodeIcon
          onPress={() => {
            navigation.navigate('QRCode');
          }}
        />
      )
    }
  }

  async componentDidMount() {
    await FcmPermissions.checkFcmPermissions();
  }

  getTotalBalance(ethBalance, daiBalance) {
    let totalUsdBalance =
      parseFloat(PriceUtilities.convertEthToUsd(ethBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(daiBalance));
    totalUsdBalance = parseFloat(totalUsdBalance).toFixed(2);
    return totalUsdBalance;
  }

  render() {
    const { wallets, balance, navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Wallets</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>
            Total Balance
          </BalanceText>
          <UsdBalance>${this.getTotalBalance(balance.ethBalance, balance.daiBalance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderThree>
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
  height: 160px;
  margin-top: 24px;
  padding: 24px;
`;

const BalanceText = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 32px;
`;

const mapStateToProps = state => ({
  wallets: state.ReducerWallets.wallets,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(WalletList));
