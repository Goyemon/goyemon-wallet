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
import { RootContainer, Button, HeaderOne, HeaderThree, QRCodeIcon } from '../components/common/';
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
        <CardContainerWithoutFeedback>
          <BalanceText>Balance</BalanceText>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <DaiBalance>{balance.daiBalance} DAI</DaiBalance>
          <ButtonContainer>
            <Button
              text="Send"
              textColor="white"
              backgroundColor="#1BA548"
              borderColor="#1BA548"
              margin="24px"
              opacity="1"
              onPress={async () => {
                navigation.navigate('SendDai');
              }}
            />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
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

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  height: 240px;
  margin-top: 24px;
  padding: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
  margin-top: 8px;
`;

const DaiBalance = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 8px;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Dai));
