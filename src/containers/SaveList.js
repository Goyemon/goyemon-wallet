'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  Container,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  TouchableCardContainer
} from '../components/common';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';
import { FCMMsgs } from '../lib/fcm.js';


class SaveList extends Component {
  componentDidMount() {
    FCMMsgs.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  getUsdValue(daiValue) {
    let usdValue = parseFloat(PriceUtilities.convertDaiToUsd(daiValue));
    usdValue = parseFloat(usdValue).toFixed(4);
    return usdValue;
  }

  render() {
    const { balance, cDaiLendingInfo, navigation } = this.props;
    const currentInterestRate = new BigNumber(cDaiLendingInfo.currentInterestRate)
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    const lifetimeEarnedInDai = RoundDownBigNumber(cDaiLendingInfo.lifetimeEarned)
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Save</HeaderOne>
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
            <InterestEarnedText>${this.getUsdValue(lifetimeEarnedInDai)}</InterestEarnedText>
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
            navigation.navigate('SaveDai');
          }}
        >
          <Container alignItems="center" flexDirection="row" justifyContent="space-between" marginTop={0} width="100%">
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
              <ValueText>{daiSavingsBalance}</ValueText>
              <ValueText>{currentInterestRate}%</ValueText>
              <DaiInterestEarnedText>{lifetimeEarnedInDai}</DaiInterestEarnedText>
            </ValueContainer>
          </Container>
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

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default withNavigation(connect(mapStateToProps)(SaveList));
