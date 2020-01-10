'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import { RootContainer, UntouchableCardContainer,
 TransactionButton, HeaderOne, HeaderThree,HeaderFour } from '../components/common/';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionsDai from '../containers/TransactionsDai';

class Dai extends Component {
  getUsdBalance() {
    try {
      return PriceUtilities.convertDaiToUsd(this.props.balance.daiBalance);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { balance, navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Dai</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">dai wallet balance</HeaderFour>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <DaiBalance>{balance.daiBalance} DAI</DaiBalance>
        </UntouchableCardContainer>
        <ButtonContainer>
          <TransactionButton
            text="Receive"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#1BA548"
            iconName="call-received"
            margin="8px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('Receive');
            }}
          />
          <TransactionButton
            text="Send"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="8px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('SendDai');
            }}
          />
        </ButtonContainer>
        <View>
          <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
            TRANSACTION HISTORY
          </HeaderThree>
        </View>
        <TransactionsDai />
      </RootContainer>
    );
  }
}

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
  margin: 0 auto;
  width: 90%;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
  margin-top: 8;
`;

const DaiBalance = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 8;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Dai));
