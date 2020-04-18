'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getGasPrice, updateGasPriceChosen } from '../actions/ActionGasPrice';
import {
  Container,
  FormHeader,
  MenuContainer,
  ToggleCurrencySymbol
} from '../components/common';
import SlippageContainer from './SlippageContainer';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class AdvancedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'USD',
      showAdvanced: false
    };
  }

  componentDidMount() {
    this.props.getGasPrice();
  }

  toggleCurrency(gasPriceWei, gasLimit) {
    if (this.state.currency === 'ETH') {
      const usdValue = TransactionUtilities.getTransactionFeeEstimateInUsd(
        gasPriceWei,
        gasLimit
      );
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        gasLimit
      );
      console.log('ethValue ==>', ethValue);
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  renderSlippageContainer() {
    if (this.props.swap) {
      return <SlippageContainer />;
    } else {
      LogUtilities.logInfo('this is not the swap component');
    }
  }

  renderAdvancedContainer() {
    if (this.state.showAdvanced) {
      return (
        <View>
          {this.renderSlippageContainer()}
          <NetworkFeeHeaderContainer>
            <FormHeader marginBottom="0" marginTop="0">
              {I18n.t('network-fee')}
            </FormHeader>
            <NetworkFeeSymbolContainer
              onPress={() => {
                // TODO: needs to be switch(), likely.
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              <ToggleCurrencySymbol currency={this.state.currency} />
            </NetworkFeeSymbolContainer>
          </NetworkFeeHeaderContainer>
          <Container
            alignItems="center"
            flexDirection="row"
            justifyContent="center"
            marginTop={24}
            width="90%"
          >
            {this.props.gasPrice.map((gasPrice, key) => (
              <NetworkFee key={key}>
                {this.props.gasChosen === key ? (
                  <SpeedContainer>
                    <SelectedSpeedTextContainer>
                      <SelectedSpeedText>{gasPrice.speed}</SelectedSpeedText>
                    </SelectedSpeedTextContainer>
                    <SelectedButton>
                      {this.toggleCurrency(gasPrice.value, this.props.gasLimit)}
                    </SelectedButton>
                  </SpeedContainer>
                ) : (
                  <SpeedContainer
                    onPress={() => {
                      this.props.updateGasPriceChosen(key);
                    }}
                  >
                    <UnselectedSpeedTextContainer>
                      <UnselectedSpeedText>
                        {gasPrice.speed}
                      </UnselectedSpeedText>
                    </UnselectedSpeedTextContainer>
                    <UnselectedButton>
                      {this.toggleCurrency(gasPrice.value, this.props.gasLimit)}
                    </UnselectedButton>
                  </SpeedContainer>
                )}
              </NetworkFee>
            ))}
          </Container>
          <MenuContainer
            onPress={() => {
              this.setState({ showAdvanced: false });
            }}
          >
            <Icon name="menu-up" color="#000" size={32} />
          </MenuContainer>
        </View>
      );
    } else if (!this.state.showAdvanced) {
      return (
        <MenuContainer
          onPress={() => {
            this.setState({ showAdvanced: true });
          }}
        >
          <Text>{I18n.t('advanced')}</Text>
          <Icon name="menu-down" color="#000" size={32} />
        </MenuContainer>
      );
    }
  }

  render() {
    return <View>{this.renderAdvancedContainer()}</View>;
  }
}

const NetworkFeeHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 24px;
  width: 90%;
`;

const NetworkFeeSymbolContainer = styled.TouchableOpacity``;

const NetworkFee = styled.View`
  margin: 0 4px;
  width: 33.3%;
`;

const NetworkFeeText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const SpeedContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 6px;
`;

const SelectedSpeedTextContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  align-items: center;
  padding: 8px;
  width: 100%;
`;

const UnselectedSpeedTextContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  align-items: center;
  padding: 8px;
  width: 100%;
`;

const SelectedSpeedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Bold';
  font-size: 16;
`;

const UnselectedSpeedText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const SelectedButton = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  margin-top: 8;
`;

const UnselectedButton = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  margin-top: 8;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen
  };
}

const mapDispatchToProps = {
  getGasPrice,
  updateGasPriceChosen
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedContainer);
