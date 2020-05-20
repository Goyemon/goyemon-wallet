'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  HeaderFive,
  GoyemonText
} from '../components/common';
import I18n from '../i18n/I18n';
import { FCMMsgs } from '../lib/fcm.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class PortfolioCompound extends Component {
  componentDidMount() {
    FCMMsgs.requestCompoundDaiInfo(this.props.checksumAddress);
  }

  render() {
    const { balance, compound } = this.props;
    const currentInterestRate = new BigNumber(compound.dai.currentInterestRate)
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const compoundDaiBalance = RoundDownBigNumber(balance.compoundDai)
      .div(new RoundDownBigNumber(10).pow(36))
      .toFixed(2);

    const lifetimeEarnedInDai = RoundDownBigNumber(compound.dai.lifetimeEarned)
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
          <HeaderFour marginTop="24">
            {I18n.t('portfolio-compound-totalsavings')}
          </HeaderFour>
          <BalanceText>
            $
            {parseFloat(
              PriceUtilities.convertDaiToUsd(compoundDaiBalance)
            ).toFixed(2)}
          </BalanceText>
          <InterestEarnedTextContainer>
            <InterestEarnedText>
              $
              {parseFloat(
                PriceUtilities.convertDaiToUsd(lifetimeEarnedInDai)
              ).toFixed(4)}
            </InterestEarnedText>
            <GoyemonText fontSize={14}> earned! </GoyemonText>
          </InterestEarnedTextContainer>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
        >
          {I18n.t('portfolio-compound-coins')}
        </HeaderThree>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="200px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <ValueContainer>
            <ValueContainerInner>
              <IconContainer>
                <CoinImage source={require('../../assets/dai_icon.png')} />
              </IconContainer>
              <View>
                <HeaderFive>
                  {I18n.t('portfolio-compound-dai-savings')}
                </HeaderFive>
                <ValueText>{compoundDaiBalance} DAI</ValueText>
              </View>
            </ValueContainerInner>
            <ValueContainerInner>
              <IconContainer>
                <Icon name="chart-line" size={40} color="#5f5f5f" />
              </IconContainer>
              <View>
                <HeaderFive>
                  {I18n.t('portfolio-compound-yearly-rate')}
                </HeaderFive>
                <ValueText>{currentInterestRate}%</ValueText>
              </View>
            </ValueContainerInner>
            <ValueContainerInner>
              <IconContainer>
                <Icon name="slope-uphill" size={40} color="#5f5f5f" />
              </IconContainer>
              <View>
                <HeaderFive>
                  {I18n.t('portfolio-compound-interest-earned')}
                </HeaderFive>
                <DaiInterestEarnedText>
                  {lifetimeEarnedInDai} DAI
                </DaiInterestEarnedText>
              </View>
            </ValueContainerInner>
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

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const IconContainer = styled.View`
  margin-right: 16;
`;

const ValueContainer = styled.View`
  align-items: flex-start;
`;

const ValueContainerInner = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: 4;
`;

const ValueText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-bottom: 8;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  font-weight: bold;
  margin-bottom: 4;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  compound: state.ReducerCompound.compound,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(PortfolioCompound));
