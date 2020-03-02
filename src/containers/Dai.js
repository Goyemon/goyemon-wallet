'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  UntouchableCardContainer,
  TransactionButton,
  HeaderOne,
  HeaderThree,
  HeaderFour
} from '../components/common/';
import PriceUtilities from '../utilities/PriceUtilities.js';

class Dai extends Component {
  render() {
    const { balance, navigation } = this.props;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiBalance = RoundDownBigNumber(balance.daiBalance)
      .div(new BigNumber(10).pow(18))
      .toString();

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
          <UsdBalance>${PriceUtilities.getDaiUsdBalance(daiBalance)}</UsdBalance>
          <DaiBalance>{daiBalance} DAI</DaiBalance>
        </UntouchableCardContainer>
        <ButtonContainer>
          <TransactionButton
            text="Send"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="8px 0"
            opacity="1"
            onPress={() => {
              navigation.navigate('SendDai');
            }}
          />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const ButtonContainer = styled.View`
  align-items: center;
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
