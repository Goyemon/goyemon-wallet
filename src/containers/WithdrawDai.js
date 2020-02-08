'use strict';
import BigNumber from "bignumber.js"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveOutgoingDaiTransactionAmount } from '../actions/ActionOutgoingDaiTransactionData';
import { getGasPriceFast, getGasPriceAverage, getGasPriceSlow } from '../actions/ActionGasPrice';
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
  CrypterestText
} from '../components/common';
import cDaiContract from '../contracts/cDaiContract';
import DebugUtilities from '../utilities/DebugUtilities.js';
import GasUtilities from '../utilities/GasUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3ProviderUtilities from '../utilities/Web3ProviderUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class WithdrawDai extends Component {
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
      daiWithdrawAmount: '',
      checked: 1,
      daiSavingsAmountValidation: undefined,
      ethAmountValidation: undefined,
      currency: 'USD'
    };
    this.web3 = Web3ProviderUtilities.web3Provider();
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance);
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
  }

  toggleCurrencySymbol() {
    if (this.state.currency === 'ETH') {
      return <CurrencySymbol><Text>ETH</Text><Icon name="swap-horizontal" size={16} color="#5f5f5f" /><CurrencySymbolTextChosen>USD</CurrencySymbolTextChosen></CurrencySymbol>;
    } else if (this.state.currency === 'USD') {
      return <CurrencySymbol><CurrencySymbolTextChosen>ETH</CurrencySymbolTextChosen><Icon name="swap-horizontal" size={16} color="#5f5f5f" /><Text>USD</Text></CurrencySymbol>;
    }
  }

  toggleCurrency(gasPriceWei) {
    if (this.state.currency === 'ETH') {
      const usdValue = this.getTransactionFeeEstimateInUsd(gasPriceWei);
      return <NetworkFeeText>${usdValue}</NetworkFeeText>;
    } else if (this.state.currency === 'USD') {
      let ethValue = GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 650000);
      ethValue = parseFloat(ethValue).toFixed(5);
      return <NetworkFeeText>{ethValue}ETH</NetworkFeeText>;
    }
  }

  getTransactionFeeEstimateInUsd(gasPriceWei) {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 650000));
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }

  getRedeemEncodedAbi(daiWithdrawAmount) {
    const cDaiContractInstance = new this.web3.eth.Contract(
      JSON.parse(cDaiContract.cDaiAbi),
      cDaiContract.cDaiAddress
    );

    const redeemAmountWithDecimals = daiWithdrawAmount * 10 ** 18;
    const redeemAmountWithHex = Web3.utils.toHex(redeemAmountWithDecimals);

    const redeemUnderlyingEncodedABI = cDaiContractInstance.methods
      .redeemUnderlying(redeemAmountWithHex)
      .encodeABI();
    return redeemUnderlyingEncodedABI;
  }

  async constructTransactionObject() {
    const transactionNonce = parseInt(TransactionUtilities.getTransactionNonce());
    const redeemUnderlyingEncodedABI = this.getRedeemEncodedAbi(this.state.daiWithdrawAmount);
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: cDaiContract.cDaiAddress,
      gasPrice: `0x${parseFloat(this.state.gasPrice[this.state.checked].gasPriceWei).toString(16)}`,
      gasLimit: `0x${parseFloat(650000).toString(16)}`,
      chainId: 3,
      data: redeemUnderlyingEncodedABI
    };
    return transactionObject;
  }

  validateDaiSavingsAmount(daiWithdrawAmount) {
    daiWithdrawAmount = new BigNumber(10).pow(36).times(daiWithdrawAmount);
    const daiSavingsBalance = new BigNumber(this.props.balance.daiSavingsBalance);

    if (
      daiSavingsBalance.isGreaterThan(0) &&
      daiSavingsBalance.isGreaterThanOrEqualTo(daiWithdrawAmount) &&
      daiWithdrawAmount.isGreaterThanOrEqualTo(0)
    ) {
      DebugUtilities.logInfo('the dai savings amount validated!');
      this.setState({ daiSavingsAmountValidation: true });
      return true;
    }
    DebugUtilities.logInfo('wrong dai balance!');
    this.setState({ daiSavingsAmountValidation: false });
    return false;
  }

  validateEthAmount() {
    let transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
      650000
    );

    const ethBalance = new BigNumber(this.ethBalance);
    transactionFeeLimitInEther = new BigNumber(transactionFeeLimitInEther);

    if (ethBalance.isGreaterThan(transactionFeeLimitInEther)) {
      DebugUtilities.logInfo('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    DebugUtilities.logInfo('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  renderInsufficientDaiBalanceMessage() {
    if (this.state.daiSavingsAmountValidation || this.state.daiSavingsAmountValidation === undefined) {
    } else {
      return <ErrorMessage>invalid amount!</ErrorMessage>;
    }
  }

  renderInsufficientEthBalanceMessage() {
    if (this.state.ethAmountValidation || this.state.ethAmountValidation === undefined) {
    } else {
      return <ErrorMessage>not enough ether!</ErrorMessage>;
    }
  }

  getAmountBorderColor() {
    if (this.state.daiSavingsAmountValidation === undefined) {
      return '#FFF';
    } else if (this.state.daiSavingsAmountValidation) {
      return '#1BA548';
    } else if (!this.state.daiSavingsAmountValidation) {
      return '#E41B13';
    }
  }

  validateForm = async daiWithdrawAmount => {
    const daiSavingsAmountValidation = this.validateDaiSavingsAmount(daiWithdrawAmount);
    const ethAmountValidation = this.validateEthAmount();

    if (daiSavingsAmountValidation && ethAmountValidation) {
      DebugUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingDaiTransactionAmount(daiWithdrawAmount);
      this.props.navigation.navigate('WithdrawDaiConfirmation');
    } else {
      DebugUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(10 ** 36)
      .toString();

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

    this.props.saveTransactionFeeEstimateEth(
      GasUtilities.getTransactionFeeEstimateInEther(
        this.state.gasPrice[this.state.checked].gasPriceWei,
        650000
      )
    );
    this.props.saveTransactionFeeEstimateUsd(
      PriceUtilities.convertEthToUsd(
        GasUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          650000
        )
      )
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Withdraw</HeaderOne>
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
            <Title>dai savings</Title>
            <Value>{daiSavingsBalance} DAI</Value>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Withdraw Amount
          </FormHeader>
          <Form borderColor={this.getAmountBorderColor()} borderWidth={1} height="56px">
            <SendTextInputContainer>
              <SendTextInput
                placeholder="amount"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={daiWithdrawAmount => {
                  this.validateDaiSavingsAmount(daiWithdrawAmount);
                  this.setState({ daiWithdrawAmount });
                }}
              />
              <CurrencySymbolText>DAI</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInsufficientDaiBalanceMessage()}</View>
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
                      <Icon name={gasPrice.imageName} size={40} color="#1BA548" />
                      <SelectedButton>{this.toggleCurrency(gasPrice.gasPriceWei)}</SelectedButton>
                    </SpeedContainer>
                  ) : (
                    <SpeedContainer
                      onPress={() => {
                        this.validateEthAmount();
                        this.setState({ checked: key });
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
          <View>{this.renderInsufficientEthBalanceMessage()}</View>
          <ButtonWrapper>
            <Button
              text="Next"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="40px auto"
              opacity="1"
              onPress={async () => {
                await this.validateForm(this.state.daiWithdrawAmount);
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
    balance: state.ReducerBalance.balance,
    gasPrice: state.ReducerGasPrice.gasPrice
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveOutgoingDaiTransactionAmount,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawDai);
