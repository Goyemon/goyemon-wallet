'use strict';
import BigNumber from "bignumber.js"
import Animation from 'lottie-react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveDaiAmount } from '../actions/ActionDaiAmount';
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
import GasUtilities from '../utilities/GasUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import Web3ProviderUtilities from '../utilities/Web3ProviderUtilities.js';

class SupplyDai extends Component {
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
      amount: '',
      checked: 1,
      daiAmountValidation: undefined,
      ethAmountValidation: undefined,
      currency: 'USD'
    };
    this.web3 = Web3ProviderUtilities.web3Provider();
    this.daiBalance = new BigNumber(props.balance.daiBalance).div(10 ** 18).toFixed(2);
    this.ethBalance = Web3.utils.fromWei(props.balance.weiBalance.toString());
  }

  componentDidMount() {
    this.props.getGasPriceFast();
    this.props.getGasPriceAverage();
    this.props.getGasPriceSlow();
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
      const ethValue = GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 100000);
      return <NetworkFeeInEther>{ethValue}ETH</NetworkFeeInEther>;
    }
  }

  getTransactionFeeEstimateInUsd(gasPriceWei) {
    return PriceUtilities.convertEthToUsd(
      GasUtilities.getTransactionFeeEstimateInEther(gasPriceWei, 100000)
    );
  }

  getMintEncodedABI(amount) {
    const cDaiContractInstance = new this.web3.eth.Contract(
      JSON.parse(cDaiContract.cDaiAbi),
      cDaiContract.cDaiAddress
    );

    const mintAmountWithDecimals = new BigNumber(parseFloat(amount)).times(10 ** 18);
    const mintAmountWithHex = Web3.utils.toHex(mintAmountWithDecimals);

    const mintEncodedABI = cDaiContractInstance.methods.mint(mintAmountWithHex).encodeABI();
    return mintEncodedABI;
  }

  async constructTransactionObject() {
    const transactionNonce = parseInt(TransactionUtilities.getTransactionNonce());
    const mintEncodedABI = this.getMintEncodedABI(this.state.amount);
    const transactionObject = {
      nonce: `0x${transactionNonce.toString(16)}`,
      to: cDaiContract.cDaiAddress,
      gasPrice: `0x${this.state.gasPrice[this.state.checked].gasPriceWei.toString(16)}`,
      gasLimit: `0x${parseFloat(250000).toString(16)}`,
      chainId: 3,
      data: mintEncodedABI
    };
    return transactionObject;
  }

  validateDaiAmount(amount) {
    if (
      parseFloat(this.daiBalance) > 0 &&
      parseFloat(this.daiBalance) >= parseFloat(amount) &&
      parseFloat(amount) >= 0 &&
      amount.length != 0
    ) {
      console.log('the dai amount validated!');
      this.setState({ daiAmountValidation: true });
      return true;
    }
    console.log('wrong dai balance!');
    this.setState({ daiAmountValidation: false });
    return false;
  }

  validateEthAmount() {
    const transactionFeeLimitInEther = GasUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
      100000
    );

    if (parseFloat(this.ethBalance) > parseFloat(transactionFeeLimitInEther)) {
      console.log('the eth amount validated!');
      this.setState({ ethAmountValidation: true });
      return true;
    }
    console.log('wrong eth balance!');
    this.setState({ ethAmountValidation: false });
    return false;
  }

  renderInsufficientDaiBalanceMessage() {
    if (this.state.daiAmountValidation || this.state.daiAmountValidation === undefined) {
      // let animationCheckedDone;
      // return (
      //   <Animation
      //     ref={(animation) => animationCheckedDone = animation}
      //     loop={false}
      //     source="require('../../assets/checked_done.json')"
      //   />
      // );
      // animationCheckedDone.play();
    } else {
      return <ErrorMessage>C'mon, you know you don't own this much 😏</ErrorMessage>;
    }
  }

  renderInsufficientEthBalanceMessage() {
    if (this.state.ethAmountValidation || this.state.ethAmountValidation === undefined) {
      // let animationCheckedDone;
      // return (
      //   <Animation
      //     ref={(animation) => animationCheckedDone = animation}
      //     loop={false}
      //     source="require('../../assets/checked_done.json')"
      //   />
      // );
      // animationCheckedDone.play();
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

  validateForm = async amount => {
    const daiAmountValidation = this.validateDaiAmount(amount);
    const ethAmountValidation = this.validateEthAmount();

    if (daiAmountValidation && ethAmountValidation) {
      console.log('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveDaiAmount(amount);
      this.props.navigation.navigate('SupplyDaiConfirmation');
    } else {
      console.log('form validation failed!');
    }
  };

  render() {
    const { balance, cDaiLendingInfo } = this.props;
    let currentInterestRate = new BigNumber(cDaiLendingInfo.currentInterestRate).div(10 ** 24);
    currentInterestRate = currentInterestRate.toFixed(2);

    this.state.gasPrice[0].gasPriceWei = this.props.gasPrice.fast;
    this.state.gasPrice[1].gasPriceWei = this.props.gasPrice.average;
    this.state.gasPrice[2].gasPriceWei = this.props.gasPrice.slow;

    this.props.saveTransactionFeeEstimateEth(
      GasUtilities.getTransactionFeeEstimateInEther(
        this.state.gasPrice[this.state.checked].gasPriceWei,
        100000
      )
    );
    this.props.saveTransactionFeeEstimateUsd(
      PriceUtilities.convertEthToUsd(
        GasUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          100000
        )
      )
    );

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Supply</HeaderOne>
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
            <Title>your dai wallet balance</Title>
            <Value>{this.daiBalance} DAI</Value>
            <Title>interest rate</Title>
            <Value>{currentInterestRate} %</Value>
          </UntouchableCardContainer>
          <FormHeader marginBottom="4" marginLeft="0" marginTop="24">
            Supply Amount
          </FormHeader>
          <Form borderColor={this.getAmountBorderColor()} borderWidth={1} height="56px">
            <SendTextInputContainer>
              <SendTextInput
                placeholder="amount"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateDaiAmount(amount);
                  this.setState({ amount });
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
                await this.validateForm(this.state.amount);
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
`;

const NetworkFee = styled.View`
  margin: 0 8px;
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
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveDaiAmount,
  getGasPriceFast,
  getGasPriceAverage,
  getGasPriceSlow
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplyDai);