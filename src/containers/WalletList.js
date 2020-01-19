'use strict';
import BigNumber from "bignumber.js"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  QRCodeIcon,
  TouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletDetail from '../containers/WalletDetail';

class WalletList extends Component {
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
    const daiBalance = new BigNumber(balance.daiBalance).div(10 ** 18).toFixed(2);
    let ethBalance = Web3.utils.fromWei(balance.weiBalance.toString());
    ethBalance = parseFloat(ethBalance).toFixed(6);

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Wallets</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">total wallet balance</HeaderFour>
          <UsdBalance>${this.getTotalBalance(ethBalance, daiBalance)}</UsdBalance>
        </UntouchableCardContainer>
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
            width="90%"
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

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const mapStateToProps = state => ({
  wallets: state.ReducerWallets.wallets,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(WalletList));
