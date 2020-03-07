'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveOutgoingDaiTransactionAmount } from '../actions/ActionOutgoingDaiTransactionData';
import {
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
} from '../actions/ActionGasPrice';
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
  ToggleCurrencySymbol,
  IsOnlineMessage
} from '../components/common';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
const GlobalConfig = require('../config.json');

class DepositDai extends Component {
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
      daiAmount: '',
      checked: props.gasPrice.chosen,
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
    if (this.props.gasPrice != prevProps.gasPrice) {
      this.setState({ checked: this.props.gasPrice.chosen });
    }
    if (this.props.balance != prevProps.balance) {
      this.setState({ ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance) });
    }
  }

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = TransactionUtilities.getTransactionFeeEstimateInUsd(gasPriceWei, 350000);
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = TransactionUtilities.getTransactionFeeEstimateInEther(
        gasPriceWei,
        350000
      );
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  async constructTransactionObject() {
    const daiAmount = this.state.daiAmount.split('.').join("");
    const decimalPlaces = TransactionUtilities.decimalPlaces(this.state.daiAmount);
    const decimals = 18 - parseInt(decimalPlaces);

    const mintEncodedABI = ABIEncoder.encodeCDAIMint(daiAmount, decimals);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(this.state.gasPrice[this.state.checked].gasPriceWei.toString(16))
      .setGas((350000).toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [this.state.checksumAddress, daiAmount, 0]);

      return transactionObject;
  }

  validateDaiAmount(daiAmount) {
    daiAmount = new BigNumber(10).pow(18).times(daiAmount);
    const daiBalance = new BigNumber(this.props.balance.daiBalance);

    if (
      daiBalance.isGreaterThanOrEqualTo(daiAmount) &&
      daiAmount.isGreaterThanOrEqualTo(0)
    ) {
      LogUtilities.logInfo('the dai amount validated!');
      this.setState({
        daiAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
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
      350000
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

  validateForm = async daiAmount => {
    const daiAmountValidation = this.validateDaiAmount(daiAmount);
    const ethAmountValidation = this.validateEthAmount(this.state.gasPrice[this.state.checked].gasPriceWei);
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && ethAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingDaiTransactionAmount(daiAmount);
      this.props.saveTransactionFeeEstimateEth(
        TransactionUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          350000
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            this.state.gasPrice[this.state.checked].gasPriceWei,
            350000
          )
        )
      );  
      this.props.navigation.navigate('DepositDaiConfirmation');
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
    const { balance, cDaiLendingInfo } = this.props;
    const currentInterestRate = new BigNumber(
      cDaiLendingInfo.currentInterestRate
    )
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new BigNumber(10).pow(18))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Deposit</HeaderOne>
        <Container>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8px"
            flexDirection="column"
            height="240px"
            justifyContent="center"
            marginTop="56"
            textAlign="center"
            width="80%"
          >
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Title>dai wallet balance</Title>
            <Value>{daiBalance} DAI</Value>
            <Title>interest rate</Title>
            <Value>{currentInterestRate} %</Value>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Deposit Amount
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
                onChangeText={daiAmount => {
                  this.validateDaiAmount(daiAmount);
                  this.setState({ daiAmount });
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
                await this.validateForm(this.state.daiAmount);
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
  font-size: 16;
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

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
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
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveOutgoingDaiTransactionAmount,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow,
  updateGasPriceChosen
};

export default connect(mapStateToProps, mapDispatchToProps)(DepositDai);
