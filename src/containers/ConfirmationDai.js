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
import ethTx from 'ethereumjs-tx';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import Web3 from 'web3';

class ConfirmationDai extends Component {
  constructor(props) {
    super();
    this.state = {
      currency: 'USD'
    };
  }

  async sendSignedTx() {
    let outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];
    await TransactionUtilities.sendOutgoingTransactionToServer(outgoingTransactionObject);
  }

  toggleCurrency() {
    if (this.state.currency === 'ETH') {
      return <CrypterestText>${this.props.transactionFeeEstimate.usd}</CrypterestText>;
    } else if (this.state.currency === 'USD') {
      return <CrypterestText>{this.props.transactionFeeEstimate.eth}ETH</CrypterestText>;
    }
  }

  render() {
    const { outgoingTransactionObjects, daiAmount, daiToAddress } = this.props;

    const gasPriceInEther = Web3.utils.fromWei(
      outgoingTransactionObjects[outgoingTransactionObjects.length - 1].gasPrice,
      'Ether'
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <CrypterestText>You are about to send</CrypterestText>
          <TotalValueText>{daiAmount} DAI</TotalValueText>
          <CrypterestText>+ network fee</CrypterestText>
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
          <ToText>{daiToAddress}</ToText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Amount
          </FormHeader>
          <AmountText>{daiAmount} DAI</AmountText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Network Fee
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              {PriceUtilities.toggleCurrencySymbol(this.state.currency)}
            </TouchableWithoutFeedback>
          </FormHeader>
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
              this.props.navigation.navigate('Dai');
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
  font-family: 'HKGrotesk-Regular';
  margin-left: 8px;
`;

const AmountText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-left: 8px;
`;

const NetworkFeeText = styled.Text`
  font-family: 'HKGrotesk-Regular';
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
    transactionFeeEstimate: state.ReducerTransactionFeeEstimate.transactionFeeEstimate,
    daiAmount: state.ReducerDaiAmount.daiAmount,
    daiToAddress: state.ReducerDaiToAddress.daiToAddress
  };
}

export default connect(mapStateToProps)(ConfirmationDai);
