'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  GoyemonText
} from '../components/common';
import I18n from '../i18n/I18n';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class PortfolioWallet extends Component {
  render() {
    const { balance, price } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.wei);
    ethBalance = RoundDownBigNumberPlacesFour(ethBalance).toFixed(4);

    const daiBalance = RoundDownBigNumberPlacesFour(balance.dai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(2);

    return (
      <RootContainer>
        <HeaderOne marginTop="112">
          {I18n.t('portfolio-wallet-header')}
        </HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="144px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="0">
            {I18n.t('portfolio-wallet-totalbalance')}
          </HeaderFour>
          <UsdBalance>
            ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
          </UsdBalance>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
        >
          {I18n.t('portfolio-wallet-coins')}
        </HeaderThree>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/ether_icon.png')} />
            <CoinText>ETH</CoinText>
          </CoinImageContainer>
          <PriceContainer>
            <PriceText>1 ETH</PriceText>
            <PriceText>= ${price.eth}</PriceText>
          </PriceContainer>
          <BalanceContainer>
            <UsdBalanceText>
              ${PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
            </UsdBalanceText>
            <BalanceText>
              <GoyemonText fontSize="20">{ethBalance} ETH</GoyemonText>
            </BalanceText>
          </BalanceContainer>
        </UntouchableCardContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CoinText>DAI</CoinText>
          </CoinImageContainer>
          <PriceContainer>
            <PriceText>1 DAI</PriceText>
            <PriceText>= ${price.dai}</PriceText>
          </PriceContainer>
          <BalanceContainer>
            <UsdBalanceText>
              ${PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
            </UsdBalanceText>
            <BalanceText>
              <GoyemonText fontSize="20">{daiBalance} DAI</GoyemonText>
            </BalanceText>
          </BalanceContainer>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const CoinImageContainer = styled.View`
  align-items: center;
  width: 20%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  margin-left: 16;
  width: 35%;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
  margin-bottom: 4;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
  margin-bottom: 4;
`;

const BalanceContainer = styled.View`
  width: 45%;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const UsdBalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 22;
  margin-bottom: 4;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(PortfolioWallet));
