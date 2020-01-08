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
import { RootContainer, TransactionButton, HeaderOne, HeaderThree, QRCodeIcon } from '../components/common/';
import PriceUtilities from '../utilities/PriceUtilities.js';
import Transactions from '../containers/Transactions';

class Ethereum extends Component {
  getUsdBalance() {
    try {
      return PriceUtilities.convertEthToUsd(this.props.balance.ethBalance);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { balance, navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Ether</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>Balance</BalanceText>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <EthBalance>{balance.ethBalance} ETH</EthBalance>
        </CardContainerWithoutFeedback>
        <ButtonContainer>
          <TransactionButton
            text="Receive"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#1BA548"
            iconName="call-received"
            margin="16px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('QRCode');
            }}
          />
          <TransactionButton
            text="Send"
            textColor="#000"
            backgroundColor="#FFF"
            borderColor="#FFF"
            iconColor="#F1860E"
            iconName="call-made"
            margin="16px 0"
            opacity="1"
            onPress={async () => {
              navigation.navigate('Send');
            }}
          />
        </ButtonContainer>
        <View>
          <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
            TRANSACTION HISTORY
          </HeaderThree>
        </View>
        <Transactions />
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

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
  margin-top: 8px;
`;

const EthBalance = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 8px;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Ethereum));
