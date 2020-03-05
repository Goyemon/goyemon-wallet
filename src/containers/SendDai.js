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
  Loader
} from '../components/common';
import HomeStack from '../navigators/HomeStack';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
const GlobalConfig = require('../config.json');

class SendDai extends Component {
  constructor(props) {
    super(props);
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
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance);
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
    }
    if (this.props.gasPrice != prevProps.gasPrice) {
      this.setState({ checked: this.props.gasPrice.chosen });
    }
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

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = this.getTransactionFeeEstimateInUsd(gasPriceWei);
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

  getTransactionFeeEstimateInUsd(gasPriceWei) {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      TransactionUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 65000)
    );
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }

  async constructTransactionObject() {
    const transactionNonce = parseInt(
      TransactionUtilities.getTransactionNonce()
    );
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      this.state.toAddress,
      this.state.amount
    );
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: GlobalConfig.DAIcontract,
      gasPrice: `0x${parseFloat(
        this.state.gasPrice[this.state.checked].gasPriceWei
      ).toString(16)}`,
      gasLimit: `0x${parseFloat(65000).toString(16)}`,
      chainId: GlobalConfig.network_id,
      data: transferEncodedABI
    };
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
    } else if (!this.state.toAddressValidation) {
      LogUtilities.logInfo('invalid address');
      this.setState({
        toAddressValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
      return false;
    }
  }

  renderInvalidToAddressMessage() {
    if (
      this.state.toAddressValidation ||
      this.state.toAddressValidation === undefined
    ) {
      return;
    } else if (!this.state.toAddressValidation) {
      return <ErrorMessage>invalid address!</ErrorMessage>;
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

  validateEthAmount() {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
      65000
    );

    const ethBalance = new BigNumber(this.ethBalance);
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

  renderInsufficientDaiBalanceMessage() {
    if (
      this.state.daiAmountValidation ||
      this.state.daiAmountValidation === undefined
    ) {
    } else {
      return <ErrorMessage>invalid amount!</ErrorMessage>;
    }
  }

  renderInsufficientEthBalanceMessage() {
    if (
      this.state.ethAmountValidation ||
      this.state.ethAmountValidation === undefined
    ) {
    } else {
      return <ErrorMessage>not enough ether!</ErrorMessage>;
    }
  }

  getAmountBorderColor() {
    if (this.state.daiAmountValidation === undefined) {
      return '#FFF';
    } else if (this.state.daiAmountValidation) {
      return '#1BA548';
    } else if (!this.state.daiAmountValidation) {
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
    const daiAmountValidation = this.validateDaiAmount(amount);
    const ethAmountValidation = this.validateEthAmount();
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
      this.props.navigation.navigate('SendDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  renderIsOnlineMessage() {
    if (this.props.netInfo) {
      return;
    }
    return <ErrorMessage>you are offline 😟</ErrorMessage>;
  }

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
              {this.toggleCurrencySymbol()}
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
                        this.validateEthAmount();
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
          <MenuUpContainer>
            <Icon
              name="menu-up"
              color="#000"
              onPress={() => {
                this.setState({ showNetworkFee: false });
              }}
              size={32}
            />
          </MenuUpContainer>
        </View>
      );
    } else if (!this.state.showNetworkFee) {
      return (
        <View>
          <Icon
            name="menu-down"
            color="#000"
            onPress={() => {
              this.setState({ showNetworkFee: true });
            }}
            size={32}
          />
        </View>
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

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

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
            borderColor={this.getToAddressBorderColor()}
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
          <View>{this.renderInvalidToAddressMessage()}</View>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Amount
          </FormHeader>
          <Form
            borderColor={this.getAmountBorderColor()}
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
          <View>{this.renderInsufficientDaiBalanceMessage()}</View>
          {this.renderNetworkFeeContainer()}
          <View>{this.renderInsufficientEthBalanceMessage()}</View>
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
          <View>{this.renderIsOnlineMessage()}</View>
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

const MenuUpContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 8px;
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

const CurrencySymbol = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 8;
`;

const CurrencySymbolTextChosen = styled.Text`
  color: #1ba548;
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
