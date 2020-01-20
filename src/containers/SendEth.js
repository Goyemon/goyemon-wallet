'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { getGasPriceFast, getGasPriceAverage, getGasPriceSlow } from '../actions/ActionGasPrice';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import {
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth
} from '../actions/ActionTransactionFeeEstimate';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  HeaderTwo,
  Form,
  FormHeader,
  CrypterestText
} from '../components/common';
import GasUtilities from '../utilities/GasUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class SendEth extends Component {
  constructor(props) {
    super();
    this.state = {
      gasPrice: [
        {
          speed: 'fast',
          imageName: 'run-fast',
          gasPriceWei: '0'
        },
        {
          speed: 'average',
          imageName: 'run',
          gasPriceWei: '0'
        },
        {
          speed: 'slow',
          imageName: 'walk',
          gasPriceWei: '0'
        }
      ],
      toAddress: '',
      amount: '',
      checked: 1,
      toAddressValidation: undefined,
      amountValidation: undefined,
      currency: 'USD'
    };
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance.toString());
    this.ethBalance = parseFloat(this.ethBalance).toFixed(6);
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
  }

  getUsdBalance() {
    try {
      return PriceUtilities.convertEthToUsd(this.ethBalance);
    } catch (err) {
      console.error(err);
    }
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return <CurrencySymbol>ETH</CurrencySymbol>;
    } else if (this.state.currency === 'USD') {
      return <CurrencySymbol>$</CurrencySymbol>;
    }
  }

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = this.getTransactionFeeEstimateInUsd(gasPriceWei);
      return <CrypterestText fontSize="16">${usdValue}</CrypterestText>;
    } else if (this.state.currency === 'USD') {
      const ethValue = GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 21000);
      return <NetworkFeeInEther>{ethValue}ETH</NetworkFeeInEther>;
    }
  }

  getTransactionFeeEstimateInUsd(gasPriceWei) {
    return PriceUtilities.convertEthToUsd(
      GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 21000)
    );
  }

  async constructTransactionObject() {
    const transactionNonce = parseInt(TransactionUtilities.getTransactionNonce());
    const amountWei = parseFloat(Web3.utils.toWei(this.state.amount, 'Ether'));
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: this.state.toAddress,
      value: `0x${amountWei.toString(16)}`,
      gasPrice: `0x${this.state.gasPrice[this.state.checked].gasPriceWei.toString(16)}`,
      gasLimit: `0x${parseFloat(21000).toString(16)}`,
      chainId: 3
    };
    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      console.log('address validated!');
      this.setState({ toAddressValidation: true });
      return true;
    } else if (!this.state.toAddressValidation) {
      console.log('invalid address');
      this.setState({ toAddressValidation: false });
      return false;
    }
  }

  renderInvalidToAddressMessage() {
    if (this.state.toAddressValidation || this.state.toAddressValidation === undefined) {
      return;
    } else if (!this.state.toAddressValidation) {
      return <ErrorMessage>invalid address!</ErrorMessage>;
    }
  }

  validateAmount(amount) {
    const transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
      21000
    );

    if (
      parseFloat(this.ethBalance) > 0 &&
      parseFloat(this.ethBalance) >=
        parseFloat(amount) + parseFloat(transactionFeeLimitInEther) &&
      parseFloat(amount) >= 0 &&
      amount.length != 0
    ) {
      console.log('the amount validated!');
      this.setState({ amountValidation: true });
      return true;
    }
    console.log('wrong balance!');
    this.setState({ amountValidation: false });
    return false;
  }

  renderInsufficientBalanceMessage() {
    if (this.state.amountValidation || this.state.amountValidation === undefined) {
    } else {
      return <ErrorMessage>C'mon, you know you don't own this much 😏</ErrorMessage>;
    }
  }

  getAmountBorderColor() {
    if (this.state.amountValidation === undefined) {
      return '#FFF';
    } else if (this.state.amountValidation) {
      return '#1BA548';
    } else if (!this.state.amountValidation) {
      return '#E41B13';
    }
  }

  getToAddressBorderColor() {
    if (this.state.toAddressValidation === undefined) {
      return '#FFF';
    } else if (this.state.toAddressValidation) {
      return '#1BA548';
    } else if (!this.state.toAddressValidation) {
      return '#E41B13';
    }
  }

  validateForm = async (toAddress, amount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const amountValidation = this.validateAmount(amount);
    if (toAddressValidation && amountValidation) {
      console.log('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.navigation.navigate('SendEthConfirmation');
    } else {
      console.log('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

    this.props.saveTransactionFeeEstimateEth(
      GasUtilities.getTransactionFeeEstimateInEther(
        this.state.gasPrice[this.state.checked].gasPriceWei,
        21000
      )
    );
    this.props.saveTransactionFeeEstimateUsd(
      PriceUtilities.convertEthToUsd(
        GasUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          21000
        )
      )
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Send</HeaderOne>
        <Container>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8px"
            flexDirection="column"
            height="160px"
            justifyContent="flex-start"
            marginTop="56px"
            textAlign="left"
            width="80%"
          >
            <CoinImage source={require('../../assets/ether_icon.png')} />
            <Title>your eth wallet balance</Title>
            <BalanceContainer>
              <Value>{this.ethBalance} ETH</Value>
              <Value>${this.getUsdBalance()}</Value>
            </BalanceContainer>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="0">
            To
          </FormHeader>
          <Form borderColor={this.getToAddressBorderColor()} borderWidth={1} height="56px">
            <SendTextInputContainer>
              <SendTextInput
                placeholder="address"
                clearButtonMode="while-editing"
                onChangeText={toAddress => {
                  this.validateToAddress(toAddress);
                  this.setState({ toAddress });
                }}
              />
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInvalidToAddressMessage()}</View>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Amount
          </FormHeader>
          <Form borderColor={this.getAmountBorderColor()} borderWidth={1} height="56px">
            <SendTextInputContainer>
              <SendTextInput
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateAmount(amount);
                  this.setState({ amount });
                }}
              />
              <CurrencySymbolText>ETH</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInsufficientBalanceMessage()}</View>
          <NetworkFeeHeaderContainer>
            <FormHeader marginBottom="0" marginLeft="0" marginTop="0">
              Network Fee
            </FormHeader>
            <NetworkFeeSymbolContainer
              onPress={() => {
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              {this.toggleCurrencySymbol()}
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
            <NetworkFeeContainer>
              {this.state.gasPrice.map((gasPrice, key) => (
                <NetworkFee key={key}>
                  {this.state.checked === key ? (
                    <SpeedContainer>
                      <SelectedButton>{gasPrice.speed}</SelectedButton>
                      <Icon name={gasPrice.imageName} size={40} color="#1BA548" />
                      <SelectedButton>{this.toggleCurrency(gasPrice.gasPriceWei)}</SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.setState({ checked: key });
                        this.validateAmount(this.state.amount);
                      }}
                    >
                      <UnselectedButton>{gasPrice.speed}</UnselectedButton>
                      <Icon name={gasPrice.imageName} size={40} color="#000" />
                      <UnselectedButton>
                        {this.toggleCurrency(gasPrice.gasPriceWei)}
                      </UnselectedButton>
                    </SpeedContainer>
                  )}
                </NetworkFee>
              ))}
            </NetworkFeeContainer>
          </UntouchableCardContainer>
          <ButtonWrapper>
            <Button
              text="Next"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="40px auto"
              opacity="1"
              onPress={async () => {
                await this.validateForm(this.state.toAddress, this.state.amount);
              }}
            />
          </ButtonWrapper>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 14;
  height: 56px;
  width: 95%;
  text-align: left;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-top: 16;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 16;
  text-transform: uppercase;
`;

const BalanceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8;
`;

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-right: 4;
`;

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

const NetworkFeeHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 24;
`;

const NetworkFeeSymbolContainer = styled.TouchableWithoutFeedback``;

const NetworkFeeContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const NetworkFee = styled.View`
  margin: 0 8px;
  width: 33.3%;
`;

const NetworkFeeInEther = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-left: 8;
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

const ButtonWrapper = styled.View`
  align-items: center;
`;

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance,
    transactions: state.ReducerTransactionHistory.transactions
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendEth);