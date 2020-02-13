'use strict';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingDaiTransactionAmount } from '../actions/ActionOutgoingDaiTransactionData';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  CrypterestText
} from '../components/common/';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class WithdrawDaiConfirmation extends Component {
  constructor(props) {
    super();
    this.state = {
      currency: 'USD'
    };
  }

  async sendSignedTx() {
    const outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];
    await TransactionUtilities.sendOutgoingTransactionToServer(outgoingTransactionObject);
    this.props.saveOutgoingDaiTransactionAmount(this.props.outgoingDaiTransactionData.amount);
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return (
        <CurrencySymbol>
          <Text>ETH</Text>
          <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
          <CurrencySymbolTextChosen>USD</CurrencySymbolTextChosen>
        </CurrencySymbol>
      );
    } else if (this.state.currency === 'USD') {
      return (
        <CurrencySymbol>
          <CurrencySymbolTextChosen>ETH</CurrencySymbolTextChosen>
          <Icon name="swap-horizontal" size={16} color="#5f5f5f" />
          <Text>USD</Text>
        </CurrencySymbol>
      );
    }
  }

  toggleCurrency() {
    if (this.state.currency === 'ETH') {
      const usdTransactionFeeEstimateValue = this.props.transactionFeeEstimate.usd.toFixed(3);
      return <NetworkFee fontSize="16">${usdTransactionFeeEstimateValue}</NetworkFee>;
    } else if (this.state.currency === 'USD') {
      return <NetworkFee fontSize="16">{this.props.transactionFeeEstimate.eth}ETH</NetworkFee>;
    }
  }

  renderIsOnlineMessage() {
    if (this.props.netInfo) {
      return;
    }
    return <ErrorMessage>you are offline 😟</ErrorMessage>;
  }

  render() {
    const { outgoingTransactionObjects, outgoingDaiTransactionData } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <CrypterestText fontSize="16">You are about to withdraw</CrypterestText>
          <TotalValue>{outgoingDaiTransactionData.amount} DAI</TotalValue>
        </TotalContainer>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="200px"
          justifyContent="flex-start"
          marginTop="0"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Withdraw Amount
          </FormHeader>
          <Amount>{outgoingDaiTransactionData.amount} DAI</Amount>
          <NetworkFeeContainer>
            <FormHeader marginBottom="0" marginLeft="8" marginTop="0">
              Network Fee
            </FormHeader>
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              {this.toggleCurrencySymbol()}
            </TouchableWithoutFeedback>
          </NetworkFeeContainer>
          <NetworkFee>{this.toggleCurrency()}</NetworkFee>
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Withdraw"
            textColor="white"
            backgroundColor="#00A3E2"
            borderColor="#00A3E2"
            margin="8px"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              if (this.props.netInfo) {
                await this.sendSignedTx();
                this.props.navigation.reset(
                  [NavigationActions.navigate({ routeName: 'EarnList' })],
                  0
                );
                this.props.navigation.navigate('History');
              }
            }}
          />
        </ButtonContainer>
        <View>{this.renderIsOnlineMessage()}</View>
      </RootContainer>
    );
  }
}

const TotalContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 40;
  margin-top: 56;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const Amount = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const NetworkFeeContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
  margin-bottom: 8;
`;

const NetworkFee = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 8;
`;

const CurrencySymbolTextChosen = styled.Text`
  color: #1ba548;
`;

const TotalValue = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  text-align: center;
  width: 100%;
`;

function mapStateToProps(state) {
  return {
    netInfo: state.ReducerNetInfo.netInfo,
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    transactionFeeEstimate: state.ReducerTransactionFeeEstimate.transactionFeeEstimate,
    outgoingDaiTransactionData: state.ReducerOutgoingDaiTransactionData.outgoingDaiTransactionData
  };
}

const mapDispatchToProps = {
  saveOutgoingDaiTransactionAmount
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawDaiConfirmation);
