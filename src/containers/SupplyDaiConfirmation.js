'use strict';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingDaiTransactionAmount } from '../actions/ActionOutgoingDaiTransactionAmount';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  CrypterestText
} from '../components/common/';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class SupplyDaiConfirmation extends Component {
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
    this.props.saveOutgoingDaiTransactionAmount(this.props.outgoingDaiTransactionAmount);
    this.props.navigation.reset([NavigationActions.navigate({ routeName: 'EarnList' })], 0);
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
      let usdTransactionFeeEstimateValue = this.props.transactionFeeEstimate.usd.toFixed(3);
      return <NetworkFee fontSize="16">${usdTransactionFeeEstimateValue}</NetworkFee>;
    } else if (this.state.currency === 'USD') {
      return <NetworkFee fontSize="16">{this.props.transactionFeeEstimate.eth}ETH</NetworkFee>;
    }
  }

  render() {
    const { outgoingTransactionObjects, outgoingDaiTransactionAmount } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <CrypterestText fontSize="16">You are about to supply</CrypterestText>
          <TotalValue>{outgoingDaiTransactionAmount} DAI</TotalValue>
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
            Supply Amount
          </FormHeader>
          <Amount>{outgoingDaiTransactionAmount} DAI</Amount>
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
            text="Supply"
            textColor="white"
            backgroundColor="#00A3E2"
            borderColor="#00A3E2"
            margin="8px"
            opacity="1"
            onPress={async () => {
              await this.sendSignedTx();
              this.props.navigation.navigate('Dai');
            }}
          />
        </ButtonContainer>
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
  font-size: 20;
  margin-left: 8;
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

function mapStateToProps(state) {
  return {
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    transactionFeeEstimate: state.ReducerTransactionFeeEstimate.transactionFeeEstimate,
    outgoingDaiTransactionAmount: state.ReducerOutgoingDaiTransactionAmount.outgoingDaiTransactionAmount
  };
}

const mapDispatchToProps = {
  saveOutgoingDaiTransactionAmount
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplyDaiConfirmation);
