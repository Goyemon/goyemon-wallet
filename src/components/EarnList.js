'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { RootContainer, HeaderOne } from '../components/common';

export default class EarnList extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="96">Earn</HeaderOne>
        <CardContainerWithoutFeedback>
          <UsdSuppliedBalanceText>Total Supplied</UsdSuppliedBalanceText>
          <UsdSuppliedBalance>$</UsdSuppliedBalance>
          <InterestEarnedText>earned!</InterestEarnedText>
        </CardContainerWithoutFeedback>
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  height: 196px;
  margin-top: 24px;
  padding: 24px;
`;

const UsdSuppliedBalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-top: 24px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const UsdSuppliedBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const InterestEarnedText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-top: 12px;
`;
