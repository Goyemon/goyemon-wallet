'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
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
import Transactions from '../containers/Transactions';

class Ethereum extends Component {
  constructor(props) {
    super(props);
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance.toString());
    this.ethBalance = parseFloat(this.ethBalance).toFixed(4);
  }

  getUsdBalance() {
    try {
      let ethUsdBalance = PriceUtilities.convertEthToUsd(this.ethBalance);
      ethUsdBalance = ethUsdBalance.toFixed(2);
      return ethUsdBalance;
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { balance, navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Ether</HeaderOne>
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
          <HeaderFour marginTop="24">eth wallet balance</HeaderFour>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <EthBalance>{this.ethBalance} ETH</EthBalance>
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
              navigation.navigate('SendEth');
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

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
  margin-top: 8;
`;

const EthBalance = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 8;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Ethereum));
