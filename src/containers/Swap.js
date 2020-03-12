'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import {
  RootContainer,
  Container,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  SwapForm,
  Loader,
  IsOnlineMessage,
  ErrorMessage
} from '../components/common';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import ABIEncoder from '../utilities/AbiUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      amount: '',
      amountValidation: undefined,
      buyValue: 0,
      slippage: 0.5,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    };
  }

  componentDidMount() {
    FcmUpstreamMsgs.requestUniswapETHDAIBalances(this.props.checksumAddress);
  }

  componentDidUpdate(prevProps) {
    if (this.props.balance != prevProps.balance) {
      this.setState({
        ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance)
      });
    }
  }

  getEthToDaiExchangeRate() {
    return 200;
    // write the logic based on the pool sizes
  }

  updateBuyValue(amount) {
    const buyValue = this.getEthToDaiExchangeRate() * amount;
    this.setState({ buyValue: buyValue });
  }

  getMinTokens(buyValue) {
    const minTokens = buyValue * ((100 - this.state.slippage) / 100);
    return minTokens;
  }

  getDeadline() {
    const timestamp = Math.floor(Date.now() / 1000);
    const deadline = timestamp + 60 * 60;
    return deadline;
  }

  async constructTransactionObject() {
    const amountWei = parseFloat(Web3.utils.toWei(this.state.amount, 'Ether'));

    const minTokens = this.getMinTokens(this.state.buyValue)
      .toString()
      .split('.')
      .join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(minTokens);
    const decimals = 18 - parseInt(decimalPlaces);
    const deadline = this.getDeadline();

    const ethToTokenSwapInputEncodedABI = ABIEncoder.encodeEthToTokenSwapInput(
      minTokens,
      deadline,
      decimals
    );

    const minTokensWithDecimals = new BigNumber(this.state.buyValue).times(new BigNumber(10).pow(18)).toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIUniswapContract)
      .setValue(amountWei.toString(16))
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16)
      )
      .setGas(GlobalConfig.UniswapEthToTokenSwapInputGasLimit.toString(16))
      .tempSetData(ethToTokenSwapInputEncodedABI)
      .addTokenOperation('uniswap', TxStorage.TxTokenOpTypeToName.eth2tok, [
        this.props.checksumAddress,
        this.state.amount,
        minTokensWithDecimals
      ]);
    // how to update the actual token amount bought
    // is this addTokenOperation right? what is the token? eth or dai?

    return transactionObject;
  }

  sendTransactions = async () => {
    const amountValidation = this.validateAmount(this.state.amount);
    const isOnline = this.props.netInfo;

    if (amountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: false });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await TransactionUtilities.sendOutgoingTransactionToServer(
        transactionObject
      );
      this.props.navigation.navigate('History');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  validateAmount(amount) {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen),
      GlobalConfig.UniswapEthToTokenSwapInputGasLimit
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
      this.setState({
        amountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
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

  render() {
    // no confirmation for now. just send after the validation
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Swap</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          marginTop="56px"
          textAlign="left"
          width="80%"
        >
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="center"
            marginTop={0}
            width="100%"
          >
            <Title>you pay</Title>
            <SwapForm
              borderBottomColor={StyleUtilities.getBorderColor(
                this.state.amountValidation
              )}
              borderBottomWidth={1}
            >
              <SendTextInput
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={amount => {
                  this.validateAmount(amount);
                  this.setState({ amount });
                  this.updateBuyValue(amount);
                }}
                returnKeyType="done"
              />
            </SwapForm>
          </Container>
          <Container
            alignItems="center"
            flexDirection="row"
            justifyContent="flex-start"
            marginTop={0}
            width="100%"
          >
            <CoinImage source={require('../../assets/ether_icon.png')} />
            <CurrencySymbolText>ETH</CurrencySymbolText>
          </Container>
        </UntouchableCardContainer>
        <View>{this.renderInsufficientBalanceMessage()}</View>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="100%"
        >
          <Icon name="swap-vertical" size={40} color="#5F5F5F" />
        </Container>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          marginTop="16"
          textAlign="left"
          width="80%"
        >
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="center"
            marginTop={0}
            width="100%"
          >
            <Title>you get</Title>
            <BuyValueText>{this.state.buyValue}</BuyValueText>
          </Container>
          <Container
            alignItems="center"
            flexDirection="row"
            justifyContent="flex-start"
            marginTop={0}
            width="100%"
          >
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </Container>
        </UntouchableCardContainer>
        <NetworkFeeContainer
          gasLimit={GlobalConfig.UniswapEthToTokenSwapInputGasLimit}
        />
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
              await this.sendTransactions();
              this.setState({ loading: false, buttonDisabled: false });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage netInfo={this.props.netInfo} />
      </RootContainer>
    );
  }
}

const SendTextInput = styled.TextInput`
  font-size: 28;
`;

const BuyValueText = styled.Text`
  font-size: 28;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-right: 16;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-bottom: 8;
  text-transform: uppercase;
`;

const CurrencySymbolText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

export default connect(mapStateToProps)(Swap);
