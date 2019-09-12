'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { RootContainer, Button, HeaderOne, HeaderTwo } from '../components/common/';
import { saveBalance } from '../actions/ActionBalance';
import styled from 'styled-components';
import firebase from 'react-native-firebase';

class Ethereum extends Component {
  async componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(async (downstreamMessage) => {
      if (downstreamMessage.data.type === "balance") {
        const balanceInWei = downstreamMessage.data.balance;
        const balanceInEther = this.props.web3.utils.fromWei(balanceInWei);
        const roundedBalanceInEther = parseFloat(balanceInEther).toFixed(4);
        this.props.saveBalance(roundedBalanceInEther);
      }
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

  getUsdBalance(roundedBalanceInEther) {
    try {
      const usdPrice = this.props.price.ethPrice;
      const ethBalance = parseFloat(roundedBalanceInEther);
      const usdBalance = usdPrice * ethBalance;
      const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedUsdBalance;
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
          <HeaderTwo color="#5F5F5F" fontSize="24px" marginBottom="8" marginLeft="8" marginTop="0">Balance</HeaderTwo>
          <UsdBalance>${this.getUsdBalance(balance)}</UsdBalance>
          <EthBalance>{balance} ETH</EthBalance>
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
          <HeaderTwo color="#000" fontSize="16px" marginBottom="16" marginLeft="16" marginTop="16">TRANSACTION HISTORY</HeaderTwo>
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

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const EthBalance = styled.Text`
  font-size: 16px;
`;

const mapStateToProps = state => ({
    transactions: state.ReducerTransactionHistory.transactions,
    web3: state.ReducerWeb3.web3,
    price: state.ReducerPrice.price,
    balance: state.ReducerBalance.balance
  });

const mapDispatchToProps = {
  saveBalance
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Ethereum)
);
