'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import { RootContainer, UntouchableCardContainer } from '../components/common';
import Countdown from './common/Countdown';

class PortfolioPoolTogetherNext extends Component {
  render() {
    return (
      <RootContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="240px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CoinText>DAI</CoinText>
          </CoinImageContainer>
          <Countdown />
          <TitleContainer>time until the next prize</TitleContainer>
          <TitleContainer>prize estimated</TitleContainer>
          <TitleContainer>balance in an open draw</TitleContainer>
          <TitleContainer>the number of tickets</TitleContainer>
          <TitleContainer>the number of players</TitleContainer>
          <ValueContainer></ValueContainer>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const CoinImageContainer = styled.View`
  align-items: center;
  width: 15%;
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
`;

const TitleContainer = styled.Text`
  margin-left: 16;
  width: 42.5%;
`;

const ValueContainer = styled.View`
  margin-left: 12;
  width: 42.5%;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(
  connect(mapStateToProps)(PortfolioPoolTogetherNext)
);
