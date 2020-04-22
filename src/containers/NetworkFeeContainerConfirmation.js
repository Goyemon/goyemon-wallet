'use strict';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  ConfirmationHeader,
  ConfirmationText,
  ToggleCurrencySymbol
} from '../components/common';
import I18n from '../i18n/I18n';
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
      return <ConfirmationText>${usdValue}</ConfirmationText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        gasLimit
      );
      console.log('ethValue ==>', ethValue);
      ethValue = parseFloat(ethValue).toFixed(5);
      return <ConfirmationText>{ethValue}ETH</ConfirmationText>;
    }
  }

  render() {
    return (
      <View>
        <NetworkFeeHeaderContainer>
          <ConfirmationHeader>{I18n.t('max-network-fee')}</ConfirmationHeader>
          <TouchableOpacity
            onPress={() => {
              if (this.state.currency === 'ETH') {
                this.setState({ currency: 'USD' });
              } else if (this.state.currency === 'USD') {
                this.setState({ currency: 'ETH' });
              }
            }}
          >
            <ToggleCurrencySymbol currency={this.state.currency} />
          </TouchableOpacity>
        </NetworkFeeHeaderContainer>
        <ConfirmationText>
          {this.toggleCurrency(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
            this.props.gasLimit
          )}
        </ConfirmationText>
      </View>
    );
  }
}

const NetworkFeeHeaderContainer = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen
  };
}

export default connect(mapStateToProps)(NetworkFeeContainerConfirmation);
