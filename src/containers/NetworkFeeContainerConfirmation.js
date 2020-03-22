'use strict';
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormHeader, ToggleCurrencySymbol } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class NetworkFeeContainerConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'USD'
    };
  }

  toggleCurrency(gasPriceWei, gasLimit) {
    if (this.state.currency === 'ETH') {
      const usdValue = TransactionUtilities.getTransactionFeeEstimateInUsd(
        gasPriceWei,
        gasLimit
      );
      return <NetworkFee fontSize="16">${usdValue}</NetworkFee>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        gasLimit
      );
      console.log('ethValue ==>', ethValue);
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFee fontSize="16">{ethValue}ETH</NetworkFee>;
    }
  }

  render() {
    return (
      <View>
        <NetworkFeeContainer>
          <FormHeader marginBottom="0" marginLeft="8" marginTop="0">
            Max Network Fee
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
            <View>
              <ToggleCurrencySymbol currency={this.state.currency} />
            </View>
          </TouchableWithoutFeedback>
        </NetworkFeeContainer>
        <NetworkFee>
          {this.toggleCurrency(
            TransactionUtilities.returnTransactionSpeed(
              this.props.gasPrice.chosen
            ),
            this.props.gasLimit
          )}
        </NetworkFee>
      </View>
    );
  }
}

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

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice
  };
}

export default connect(mapStateToProps)(NetworkFeeContainerConfirmation);
