'use strict';
import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  CrypterestText
} from '../components/common/';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3 from 'web3';

class Confirmation extends Component {
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
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return <CurrencySymbol>ETH</CurrencySymbol>;
    } else if (this.state.currency === 'USD') {
      return <CurrencySymbol>$</CurrencySymbol>;
    }
  }

  toggleCurrency() {
    if (this.state.currency === 'ETH') {
      return (
        <NetworkFeeText fontSize="16px">${this.props.transactionFeeEstimate.usd}</NetworkFeeText>
      );
    } else if (this.state.currency === 'USD') {
      return (
        <NetworkFeeText fontSize="16px">{this.props.transactionFeeEstimate.eth}ETH</NetworkFeeText>
      );
    }
  }

  render() {
    const { outgoingTransactionObjects } = this.props;

    const valueInEther = parseFloat(
      Web3.utils.fromWei(
        outgoingTransactionObjects[outgoingTransactionObjects.length - 1].value,
        'Ether'
      )
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/ether_icon.png')} />
          <CrypterestText fontSize="16px">You are about to send</CrypterestText>
          <TotalValueText>{valueInEther} ETH</TotalValueText>
          <CrypterestText fontSize="16px">+ network fee</CrypterestText>
        </TotalContainer>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="280px"
          justifyContent="flex-start"
          marginTop="0"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            To
          </FormHeader>
          <ToText>{outgoingTransactionObjects[outgoingTransactionObjects.length - 1].to}</ToText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Amount
          </FormHeader>
          <AmountText>{valueInEther} ETH</AmountText>
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
          <NetworkFeeText>{this.toggleCurrency()}</NetworkFeeText>
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Confirm"
            textColor="white"
            backgroundColor="#00A3E2"
            borderColor="#00A3E2"
            margin="8px"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('Ethereum');
              await this.sendSignedTx();
            }}
          />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const TotalContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-bottom: 56px;
  margin-top: 56px;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const ToText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8px;
`;

const AmountText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8px;
`;

const NetworkFeeContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const NetworkFeeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8px;
`;

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
  margin-left: 8px;
`;

const TotalValueText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

function mapStateToProps(state) {
  return {
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    transactionFeeEstimate: state.ReducerTransactionFeeEstimate.transactionFeeEstimate
  };
}

export default connect(mapStateToProps)(Confirmation);
