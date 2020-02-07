'use strict';
import BigNumber from "bignumber.js"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  TouchableCardContainer
} from '../components/common';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import PriceUtilities from '../utilities/PriceUtilities.js';

class EarnList extends Component {
  async componentDidMount() {
    await FcmUpstreamMsgs.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  getUsdValue(daiValue) {
    let usdValue = parseFloat(PriceUtilities.convertDaiToUsd(daiValue));
    usdValue = parseFloat(usdValue).toFixed(4);
    return usdValue;
  }

  render() {
    const { balance, cDaiLendingInfo, navigation } = this.props;
    let currentInterestRate = new BigNumber(cDaiLendingInfo.currentInterestRate).div(10 ** 24);
    currentInterestRate = currentInterestRate.toFixed(2);
    let lifetimeEarnedInDai = new BigNumber(cDaiLendingInfo.lifetimeEarned).div(10 ** 36);
    lifetimeEarnedInDai = lifetimeEarnedInDai.toFixed(4);

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(10 ** 36)
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Earn</HeaderOne>
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
          <BalanceText>${this.getUsdValue(daiSavingsBalance)}</BalanceText>
          <InterestEarnedTextContainer>
            <InterestEarnedText>
              ${this.getUsdValue(lifetimeEarnedInDai)}
            </InterestEarnedText>
            <Text> earned! </Text>
          </InterestEarnedTextContainer>
        </UntouchableCardContainer>
        <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderThree>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          textAlign="center"
          width="90%"
          onPress={() => {
            navigation.navigate('EarnDai');
          }}
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Text>Dai</Text>
          </CoinImageContainer>
          <TitleContainer>
            <TitleText>savings balance</TitleText>
            <TitleText>yearly interest rate</TitleText>
            <TitleText>interest earned</TitleText>
          </TitleContainer>
          <ValueContainer>
            <ValueText>{daiSavingsBalance} DAI</ValueText>
            <ValueText>{currentInterestRate}%</ValueText>
            <DaiInterestEarnedText>{lifetimeEarnedInDai} DAI</DaiInterestEarnedText>
          </ValueContainer>
        </TouchableCardContainer>
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
  width: 20%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-bottom: 8;
  width: 40px;
`;

const TitleContainer = styled.View`
  margin-left: 8;
  width: 50%;
`;

const TitleText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 8;
`;

const ValueContainer = styled.View`
  margin-left: 12;
  width: 30%;
`;

const ValueText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 4;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 4;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default withNavigation(connect(mapStateToProps)(EarnList));
