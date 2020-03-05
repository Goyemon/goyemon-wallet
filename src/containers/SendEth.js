'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import {
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
} from '../actions/ActionGasPrice';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
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
import TxStorage from '../lib/tx.js';
const GlobalConfig = require('../config.json');

class SendEth extends Component {
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
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      toAddress: '',
      amount: '',
      checked: props.gasPrice.chosen,
      toAddressValidation: undefined,
      amountValidation: undefined,
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
      const usdValue = TransactionUtilities.getTransactionFeeEstimateInUsd(gasPriceWei, 21000);
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        21000
      );
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  constructTransactionObject() {
    const transactionNonce = TxStorage.storage.getNextNonce();
    const amountWei = parseFloat(Web3.utils.toWei(this.state.amount, 'Ether'));

    const transactionObject = TxStorage.storage.newTx()
      .setNonce(transactionNonce)
      .setTo(this.state.toAddress)
      .setValue(amountWei.toString(16))
      .setGasPrice(this.state.gasPrice[this.state.checked].gasPriceWei.toString(16))
      .setGas(parseInt(21000).toString(16));

    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('address validated!');
      this.setState({ toAddressValidation: true });
      if (this.state.amountValidation === true) {
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

  validateAmount(amount) {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
      21000
    );

    const ethBalance = new BigNumber(this.state.ethBalance);

    amount = new BigNumber(amount);
    transactionFeeLimitInEther = new BigNumber(transactionFeeLimitInEther);

    if (
      ethBalance.isGreaterThanOrEqualTo(
        amount.plus(transactionFeeLimitInEther)
      ) &&
      amount.isGreaterThanOrEqualTo(0)
    ) {
      LogUtilities.logInfo('the amount validated!');
      this.setState({ amountValidation: true });
      if (this.state.toAddressValidation === true) {
        this.setState({ buttonDisabled: false, buttonOpacity: 1 });
      }
      return true;
    }
    LogUtilities.logInfo('wrong balance!');
    this.setState({
      amountValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
    return false;
  }

  renderInsufficientBalanceMessage() {
    if (
      this.state.amountValidation ||
      this.state.amountValidation === undefined
    ) {
    } else {
      return <ErrorMessage>invalid amount!</ErrorMessage>;
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
    const isOnline = this.props.netInfo;

    if (toAddressValidation && amountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.navigation.navigate('SendEthConfirmation');
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
              onPress={() => { // TODO: needs to be switch(), likely.
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
    const { balance } = this.props;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const ethBalance = RoundDownBigNumber(this.state.ethBalance).toFixed(4);

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

    this.props.saveTransactionFeeEstimateEth(
      TransactionUtilities.getTransactionFeeEstimateInEther(
        this.state.gasPrice[this.state.checked].gasPriceWei,
        21000
      )
    );
    this.props.saveTransactionFeeEstimateUsd(
      PriceUtilities.convertEthToUsd(
        TransactionUtilities.getTransactionFeeEstimateInEther(
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
            <Title>eth wallet balance</Title>
            <BalanceContainer>
              <Value>{ethBalance} ETH</Value>
              <Value>${PriceUtilities.getEthUsdBalance(this.state.ethBalance)}</Value>
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
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateAmount(amount);
                  this.setState({ amount });
                }}
                returnKeyType="done"
              />
              <CurrencySymbolText>ETH</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInsufficientBalanceMessage()}</View>
          {this.renderNetworkFeeContainer()}
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
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen,
  clearQRCodeData
};

export default connect(mapStateToProps, mapDispatchToProps)(SendEth);
