'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getGasPrice, updateGasPriceChosen } from '../actions/ActionGasPrice';
import {
  Container,
  UntouchableCardContainer,
  FormHeader,
  MenuContainer,
  ToggleCurrencySymbol
} from '../components/common';
import SlippageContainer from './SlippageContainer';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class AdvancedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: [
        {
          speed: 'fast',
          imageName: 'run-fast',
          gasPriceWei: props.gasPrice.fast
        },
        {
          speed: 'average',
          imageName: 'run',
          gasPriceWei: props.gasPrice.average
        },
        {
          speed: 'slow',
          imageName: 'walk',
          gasPriceWei: props.gasPrice.slow
        }
      ],
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
            <FormHeader marginBottom="0" marginLeft="0" marginTop="0">
              Network Fee
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
              <View>
                <ToggleCurrencySymbol currency={this.state.currency} />
              </View>
            </NetworkFeeSymbolContainer>
          </NetworkFeeHeaderContainer>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="0"
            flexDirection="column"
            height="120px"
            justifyContent="center"
            marginTop="16"
            textAlign="center"
            width="80%"
          >
            <Container
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              marginTop={0}
              width="100%"
            >
              {this.state.gasPrice.map((gasPrice, key) => (
                <NetworkFee key={key}>
                  {this.props.gasPrice.chosen === key ? (
                    <SpeedContainer>
                      <SelectedButton>{gasPrice.speed}</SelectedButton>
                      <Icon
                        name={gasPrice.imageName}
                        size={40}
                        color="#1BA548"
                      />
                      <SelectedButton>
                        {this.toggleCurrency(
                          gasPrice.gasPriceWei,
                          this.props.gasLimit
                        )}
                      </SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.props.updateGasPriceChosen(key);
                      }}
                    >
                      <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                      <Icon name={gasPrice.imageName} size={40} color="#000" />
                      <UnselectedButton>
                        {this.toggleCurrency(
                          gasPrice.gasPriceWei,
                          this.props.gasLimit
                        )}
                      </UnselectedButton>
                    </SpeedContainer>
                  )}
                </NetworkFee>
              ))}
            </Container>
          </UntouchableCardContainer>
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
          <Text>advanced</Text>
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
  justify-content: center;
  margin-top: 24;
`;

const NetworkFeeSymbolContainer = styled.TouchableWithoutFeedback``;

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
  margin: 0 8px;
`;

const SelectedButton = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
`;

const UnselectedButton = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice
  };
}

const mapDispatchToProps = {
  getGasPrice,
  updateGasPriceChosen
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedContainer);
