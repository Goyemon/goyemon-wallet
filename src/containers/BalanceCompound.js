'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  SettingsIcon
} from '../components/common';
import { FCMMsgs } from '../lib/fcm.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class BalanceCompound extends Component {
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

  componentDidMount() {
    FCMMsgs.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  render() {
    const { balance, cDaiLendingInfo } = this.props;
    const currentInterestRate = new BigNumber(
      cDaiLendingInfo.currentInterestRate
    )
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(new RoundDownBigNumber(10).pow(36))
      .toFixed(2);

    const lifetimeEarnedInDai = RoundDownBigNumber(
      cDaiLendingInfo.lifetimeEarned
    )
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="112">Compound</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="center"
          width="90%"
        >
          <HeaderFour marginTop="24">total savings</HeaderFour>
          <BalanceText>
            $
            {parseFloat(
              PriceUtilities.convertDaiToUsd(daiSavingsBalance)
            ).toFixed(2)}
          </BalanceText>
          <InterestEarnedTextContainer>
            <InterestEarnedText>
              $
              {parseFloat(
                PriceUtilities.convertDaiToUsd(lifetimeEarnedInDai)
              ).toFixed(4)}
            </InterestEarnedText>
            <Text> earned! </Text>
          </InterestEarnedTextContainer>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
        >
          Coins
        </HeaderThree>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="144px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Text>Dai</Text>
          </CoinImageContainer>
          <TitleContainer>
            <TitleText>dai savings</TitleText>
            <TitleText>yearly rate</TitleText>
            <TitleText>interest earned</TitleText>
          </TitleContainer>
          <ValueContainer>
            <ValueText>{daiSavingsBalance} DAI</ValueText>
            <ValueText>{currentInterestRate}%</ValueText>
            <DaiInterestEarnedText>{lifetimeEarnedInDai} DAI</DaiInterestEarnedText>
          </ValueContainer>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const BalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const InterestEarnedTextContainer = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-top: 16;
`;

const InterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
`;

const CoinImageContainer = styled.View`
  align-items: center;
  width: 15%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-bottom: 8;
  width: 40px;
`;

const TitleContainer = styled.View`
  margin-left: 16;
  width: 42.5%;
`;

const TitleText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 8;
`;

const ValueContainer = styled.View`
  margin-left: 12;
  width: 42.5%;
`;

const ValueText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 8;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  font-weight: bold;
  margin-bottom: 4;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(BalanceCompound));
