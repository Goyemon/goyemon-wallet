'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderFive,
  GoyemonText
} from '../components/common';
import Countdown from './common/Countdown';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';

class PortfolioPoolTogetherNext extends Component {
  render() {
    const pooltogetherDaiOpenBalance = RoundDownBigNumber(
      this.props.balance.pooltogetherDai.open
    )
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);

    return (
      <RootContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="320px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CoinText>DAI</CoinText>
          </CoinImageContainer>
          <HeaderFive>time until the open round ends</HeaderFive>
          <Countdown />
          <HeaderFive>your balance in an open draw</HeaderFive>
          <GoyemonText fontSize={14}>{pooltogetherDaiOpenBalance} DAI</GoyemonText>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const CoinImageContainer = styled.View`
  align-items: center;
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
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(
  connect(mapStateToProps)(PortfolioPoolTogetherNext)
);
