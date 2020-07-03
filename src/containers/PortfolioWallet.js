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
        <TokenBalanceCard
          price={price.eth}
          balance={ethBalance}
          usd={PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
          iconPath={require('../../assets/ether_icon.png')}
          token="ETH"
        />
        <TokenBalanceCard
          price={price.dai}
          balance={daiBalance}
          usd={PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
          iconPath={require('../../assets/dai_icon.png')}
          token="DAI"
        />
        <TokenBalanceCard
          price={price.dai}
          balance={daiBalance}
          usd={PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
          iconPath={require('../../assets/cdai_icon.png')}
          token="cDAI"
        />
        <TokenBalanceCard
          price={price.dai}
          balance={daiBalance}
          usd={PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
          iconPath={require('../../assets/pldai_icon.png')}
          token="plDAI"
        />
      </RootContainer>
    );
  }
}

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

const TokenBalanceCard = props =>
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
        <CoinImage source={props.iconPath} />
        <CoinText>{props.token}</CoinText>
      </CoinImageContainer>
      <PriceContainer>
        <PriceText>1 {props.token}</PriceText>
        <PriceText>= ${props.price}</PriceText>
      </PriceContainer>
      <BalanceContainer>
        <UsdBalanceText>
          ${props.usd}
        </UsdBalanceText>
        <BalanceText>
          <GoyemonText fontSize="20">{props.balance} {props.token}</GoyemonText>
        </BalanceText>
      </BalanceContainer>
    </UntouchableCardContainer>

const CoinImageContainer = styled.View`
  align-items: center;
  width: 20%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
  margin-bottom: 4;
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

const BalanceContainer = styled.View`
  width: 45%;
`;

const UsdBalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 22;
  margin-bottom: 4;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

export default withNavigation(connect(mapStateToProps)(PortfolioWallet));
