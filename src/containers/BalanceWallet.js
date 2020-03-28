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
  HeaderFour,
  CrypterestText,
  SettingsIcon
} from '../components/common';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class BalanceWallet extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <SettingsIcon
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
      ),
      headerStyle: { height: 80 }
    };
  };

  render() {
    const { balance } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.weiBalance);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);

    const daiBalance = RoundDownBigNumber(balance.daiBalance)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Wallet</HeaderOne>
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
          <UsdBalance>
            ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
          </UsdBalance>
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
            <CoinImage source={require('../../assets/ether_icon.png')} />
          </CoinImageContainer>
          <PriceContainer>
            <CoinText>ETH</CoinText>
            <CrypterestText fontSize="16">
              1 ETH = ${this.props.price.eth}
            </CrypterestText>
          </PriceContainer>
          <BalanceContainer>
            <UsdBalanceText>
              ${PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
            </UsdBalanceText>
            <BalanceText>
              <CrypterestText fontSize="20">{ethBalance} ETH</CrypterestText>
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
          </CoinImageContainer>
          <PriceContainer>
            <CoinText>DAI</CoinText>
            <CrypterestText fontSize="16">
              1 DAI = ${this.props.price.dai}
            </CrypterestText>
          </PriceContainer>
          <BalanceContainer>
            <UsdBalanceText>
              ${PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
            </UsdBalanceText>
            <BalanceText>
              <CrypterestText fontSize="20">{daiBalance} DAI</CrypterestText>
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
  width: 15%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  margin-left: 16;
  width: 42.5%;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 4;
`;

const BalanceContainer = styled.View`
  width: 42.5%;
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

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(BalanceWallet));
