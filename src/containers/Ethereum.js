'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { RootContainer, Button, HeaderOne, HeaderThree, QRCodeIcon } from '../components/common/';
import styled from 'styled-components';
import PriceUtilities from '../utilities/PriceUtilities.js';

class Ethereum extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
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
      return PriceUtilities.convertEthToUsd(this.props.balance.ethBalance);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { transactions, balance, navigation } = this.props;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Ether</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>
            Balance
          </BalanceText>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <EthBalance>{balance.ethBalance} ETH</EthBalance>
          <ButtonContainer>
            <Button
              text="Send"
              textColor="white"
              backgroundColor="#12BB4F"
              borderColor="#12BB4F"
              margin="8px"
              opacity="1"
              onPress={async () => {
                navigation.navigate('Send');
              }}
            />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
        <View>
          <HeaderThree marginBottom="16" marginLeft="16" marginTop="16">
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
  height: 240px;
  margin-top: 24px;
  padding: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

const BalanceText = styled.Text`
  color: #5F5F5F;
  font-size: 24px;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
`;

const EthBalance = styled.Text`
  font-size: 16px;
`;

const mapStateToProps = state => ({
  transactions: state.ReducerTransactionHistory.transactions,
  web3: state.ReducerWeb3.web3,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(Ethereum));
