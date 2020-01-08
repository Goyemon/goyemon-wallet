'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import { RootContainer, TransactionButton, HeaderOne } from '../components/common/';

class EarnDai extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Dai</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>Dai supplied</BalanceText>
        </CardContainerWithoutFeedback>
        <ButtonContainer>
          <TransactionButton
            text="Withdraw"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#1BA548"
            iconName="call-received"
            margin="16px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('WithdrawDai');
            }}
          />
          <TransactionButton
            text="Supply"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="16px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('SupplyDai');
            }}
          />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  borderRadius: 8px;
  height: 160px;
  margin: 8px auto;
  margin-top: 24px;
  padding: 24px;
  width: 85%
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
  margin: 0 auto;
  width: 85%;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
  text-transform: uppercase;
`;

export default withNavigation(EarnDai);
