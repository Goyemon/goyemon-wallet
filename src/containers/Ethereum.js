'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { RootContainer, Button, HeaderOne, HeaderTwo } from '../components/common/';
import styled from 'styled-components';
import PriceUtilities from '../utilities/PriceUtilities.js';

class Ethereum extends Component {
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
          <HeaderTwo color="#5F5F5F" fontSize="24px" marginBottom="8" marginLeft="8" marginTop="0">
            Balance
          </HeaderTwo>
          <UsdBalance>${this.getUsdBalance()}</UsdBalance>
          <EthBalance>{balance.ethBalance} ETH</EthBalance>
          <ButtonContainer>
            <Button
              text="Receive"
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              margin="8px"
              opacity="1"
              onPress={() => navigation.navigate('Receive')}
            />
            <Button
              text="Send"
              textColor="white"
              backgroundColor="#12BB4F"
              margin="8px"
              opacity="1"
              onPress={async () => {
                navigation.navigate('Send');
              }}
            />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
        <View>
          <HeaderTwo color="#000" fontSize="16px" marginBottom="16" marginLeft="16" marginTop="16">
            TRANSACTION HISTORY
          </HeaderTwo>
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
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
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
