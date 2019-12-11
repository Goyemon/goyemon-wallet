'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import TransactionsDai from '../containers/TransactionsDai';
import { RootContainer, Button, HeaderOne, HeaderThree, QRCodeIcon } from '../components/common/';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PriceUtilities from '../utilities/PriceUtilities.js';

class Dai extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      headerTitle: () => <HeaderThree color="#E41B13" marginBottom="0" marginLeft="0" marginTop="16">crypterest</HeaderThree>,
      headerRight: (
        <QRCodeIcon
          onPress={() => {
            navigation.navigate('QRCode');
          }}
        />
      )
    }
  }

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
          <BalanceText>
            Balance
          </BalanceText>
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
  height: ${hp('25%')};
  margin-top: 24px;
  padding: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const BalanceText = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: 24px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 28px;
  margin-top: 8px;
`;

const DaiBalance = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-top: 8px;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Dai));
