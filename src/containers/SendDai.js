'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import {
  saveOutgoingDaiTransactionAmount,
  saveOutgoingDaiTransactionToAddress
} from '../actions/ActionOutgoingDaiTransactionData';
import {
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
} from '../actions/ActionGasPrice';
import { clearQRCodeData } from '../actions/ActionQRCodeData';
import {
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth
} from '../actions/ActionTransactionFeeEstimate';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  MenuContainer,
  ToggleCurrencySymbol,
  IsOnlineMessage,
  InsufficientEthBalanceMessage,
  InvalidToAddressMessage,
  InsufficientDaiBalanceMessage,
  ErrorMessage
} from '../components/common';
import HomeStack from '../navigators/HomeStack';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
const GlobalConfig = require('../config.json');

class SendDai extends Component {
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
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      toAddress: '',
      amount: '',
      checked: props.gasPrice.chosen,
      toAddressValidation: undefined,
      daiAmountValidation: undefined,
      ethAmountValidation: undefined,
      currency: 'USD',
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
      showNetworkFee: false
    };
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
    this.validateEthAmount(this.state.gasPrice[this.state.checked].gasPriceWei);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
    }
    if (this.props.gasPrice != prevProps.gasPrice) {
      this.setState({ checked: this.props.gasPrice.chosen });
    }
    if (this.props.balance != prevProps.balance) {
      this.setState({ ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance) });
    }
  }

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = TransactionUtilities.getTransactionFeeEstimateInUsd(gasPriceWei, 65000);
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        65000
      );
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  async constructTransactionObject() {
    const amount = this.state.amount.split('.').join("");
    const decimalPlaces = TransactionUtilities.decimalPlaces(this.state.amount);
    const decimals = 18 - parseInt(decimalPlaces);
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      this.state.toAddress,
      amount,
      decimals
    );

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIcontract)
      .setGasPrice(this.state.gasPrice[this.state.checked].gasPriceWei.toString(16))
      .setGas((65000).toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.transfer, [this.state.checksumAddress, GlobalConfig.DAIcontract, amount]);

    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('address validated!');
      this.setState({ toAddressValidation: true });
      if (this.state.daiAmountValidation === true) {
        this.setState({ buttonDisabled: false, buttonOpacity: 1 });
      }
      return true;
    } else if (!Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('invalid address');
      this.setState({
        toAddressValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
      return false;
    }
  }

  validateDaiAmount(amount) {
    amount = new BigNumber(10).pow(18).times(amount);
    const daiBalance = new BigNumber(this.props.balance.daiBalance);

    if (
      daiBalance.isGreaterThanOrEqualTo(amount) &&
      amount.isGreaterThanOrEqualTo(0)
    ) {
      LogUtilities.logInfo('the dai amount validated!');
      this.setState({ daiAmountValidation: true });
      if (this.state.toAddressValidation === true) {
        this.setState({ buttonDisabled: false, buttonOpacity: 1 });
      }
      return true;
    }
    LogUtilities.logInfo('wrong dai balance!');
    this.setState({
      daiAmountValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
    return false;
  }

  validateEthAmount(gasPriceWei) {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      gasPriceWei,
      65000
    );

    const ethBalance = new BigNumber(this.state.ethBalance);
    transactionFeeLimitInEther = new BigNumber(transactionFeeLimitInEther);

    if (ethBalance.isGreaterThan(transactionFeeLimitInEther)) {
      LogUtilities.logInfo('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    LogUtilities.logInfo('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  validateForm = async (toAddress, amount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const daiAmountValidation = this.validateDaiAmount(amount);
    const ethAmountValidation = this.validateEthAmount(this.state.gasPrice[this.state.checked].gasPriceWei);
    const isOnline = this.props.netInfo;

    if (
      toAddressValidation &&
      daiAmountValidation &&
      ethAmountValidation &&
      isOnline
    ) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingDaiTransactionAmount(amount);
      await this.props.saveOutgoingDaiTransactionToAddress(toAddress);
      this.props.saveTransactionFeeEstimateEth(
        TransactionUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          65000
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            this.state.gasPrice[this.state.checked].gasPriceWei,
            65000
          )
        )
      );
  
      this.props.navigation.navigate('SendDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  renderNetworkFeeContainer() {
    if (this.state.showNetworkFee) {
      return (
        <View>
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
            justifyContent="flex-start"
            marginTop="16"
            textAlign="left"
            width="80%"
          >
            <NetworkFeeContainer>
              {this.state.gasPrice.map((gasPrice, key) => (
                <NetworkFee key={key}>
                  {this.state.checked === key ? (
                    <SpeedContainer>
                      <SelectedButton>{gasPrice.speed}</SelectedButton>
                      <Icon
                        name={gasPrice.imageName}
                        size={40}
                        color="#1BA548"
                      />
                      <SelectedButton>
                        {this.toggleCurrency(gasPrice.gasPriceWei)}
                      </SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.setState({ checked: key });
                        this.props.updateGasPriceChosen(key);
                        this.validateEthAmount(gasPrice.gasPriceWei);
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
          <MenuContainer>
            <Icon
              name="menu-up"
              color="#000"
              onPress={() => {
                this.setState({ showNetworkFee: false });
              }}
              size={32}
            />
          </MenuContainer>
        </View>
      );
    } else if (!this.state.showNetworkFee) {
      return (
        <MenuContainer>
          <Icon
            name="menu-down"
            color="#000"
            onPress={() => {
              this.setState({ showNetworkFee: true });
            }}
            size={32}
          />
        </MenuContainer>
      );
    }
  }

  render() {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new BigNumber(10).pow(18))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Send</HeaderOne>
        <Container>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8px"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            marginTop="56"
            textAlign="center"
            width="80%"
          >
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Title>dai wallet balance</Title>
            <BalanceContainer>
              <Value>{daiBalance} DAI</Value>
            </BalanceContainer>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="0">
            To
          </FormHeader>
          <Form
            borderColor={StyleUtilities.getBorderColor(this.state.toAddressValidation)}
            borderWidth={1}
            height="56px"
          >
            <SendTextInputContainer>
              <SendTextInput
                placeholder="address"
                clearButtonMode="while-editing"
                onChangeText={toAddress => {
                  this.validateToAddress(toAddress);
                  this.setState({ toAddress });
                }}
                value={this.state.toAddress}
              />
              <TouchableOpacity
                onPress={() => {
                  this.props.clearQRCodeData();
                  HomeStack.navigationOptions = () => {
                    const tabBarVisible = false;
                    return {
                      tabBarVisible
                    };
                  };
                  this.props.navigation.navigate('QRCodeScan');
                }}
              >
                <Icon name="qrcode-scan" size={16} color="#5f5f5f" />
              </TouchableOpacity>
            </SendTextInputContainer>
          </Form>
          <InvalidToAddressMessage toAddressValidation={this.state.toAddressValidation} />
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Amount
          </FormHeader>
          <Form
            borderColor={StyleUtilities.getBorderColor(this.state.daiAmountValidation)}
            borderWidth={1}
            height="56px"
          >
            <SendTextInputContainer>
              <SendTextInput
                placeholder="amount"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateDaiAmount(amount);
                  this.setState({ amount });
                }}
                returnKeyType="done"
              />
              <CurrencySymbolText>DAI</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <InsufficientDaiBalanceMessage daiAmountValidation={this.state.daiAmountValidation} />
          {this.renderNetworkFeeContainer()}
          <InsufficientEthBalanceMessage ethAmountValidation={this.state.ethAmountValidation} />
          <ButtonWrapper>
            <Button
              text="Next"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              disabled={this.state.buttonDisabled}
              margin="40px auto"
              marginBottom="12px"
              opacity={this.state.buttonOpacity}
              onPress={async () => {
                await this.validateForm(
                  this.state.toAddress,
                  this.state.amount
                );
                this.setState({ loading: false, buttonDisabled: false });
              }}
            />
            <Loader animating={this.state.loading} />
          </ButtonWrapper>
          <IsOnlineMessage netInfo={this.props.netInfo} />
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
  margin-top: 16px;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 16px;
  text-transform: uppercase;
`;

const BalanceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
`;

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 4;
`;

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

const NetworkFeeHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const NetworkFeeSymbolContainer = styled.TouchableWithoutFeedback``;

const NetworkFeeContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

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

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance,
    netInfo: state.ReducerNetInfo.netInfo,
    qrCodeData: state.ReducerQRCodeData.qrCodeData,
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveOutgoingDaiTransactionAmount,
  saveOutgoingDaiTransactionToAddress,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen,
  clearQRCodeData
};

export default connect(mapStateToProps, mapDispatchToProps)(SendDai);
