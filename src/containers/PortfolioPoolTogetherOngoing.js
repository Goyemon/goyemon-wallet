'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderFive
} from '../components/common';
import Countdown from './common/Countdown';

class PortfolioPoolTogetherOngoing extends Component {
  render() {
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
          <HeaderFive>time until the next prize</HeaderFive>
          <Countdown />
          <HeaderFive>the pool balance</HeaderFive>
          <HeaderFive>prize estimated</HeaderFive>
          <HeaderFive>balance in a committed draw</HeaderFive>
          <HeaderFive>the number of tickets</HeaderFive>
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
  connect(mapStateToProps)(PortfolioPoolTogetherOngoing)
);
