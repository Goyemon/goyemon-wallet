'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderFour,
} from '../components/common';

class BalancePoolTogether extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="112">PoolTogether</HeaderOne>
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
          <HeaderFour marginTop="24">the number of tickets</HeaderFour>
          <BalanceText></BalanceText>
        </UntouchableCardContainer>
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
            <CoinText>DAI</CoinText>
          </CoinImageContainer>
          <TitleContainer></TitleContainer>
          <ValueContainer></ValueContainer>
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

const TitleContainer = styled.View`
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

export default withNavigation(connect(mapStateToProps)(BalancePoolTogether));
