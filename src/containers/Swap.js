'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionDataSwap } from '../actions/ActionOutgoingTransactionData';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
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
import AdvancedContainer from '../containers/AdvancedContainer';
import I18n from '../i18n/I18n';
import ABIEncoder from '../utilities/AbiUtilities';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.wei),
      ethSold: '',
      tokenBought: new RoundDownBigNumber(0),
      ethSoldValidation: undefined,
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
        ethBalance: Web3.utils.fromWei(this.props.balance.wei)
      });
    }
  }

  getTokenBought(ethSold, weiReserve, tokenReserve) {
    weiReserve = new BigNumber(weiReserve, 16);
    tokenReserve = new BigNumber(tokenReserve, 16);
    let weiSold = Web3.utils.toWei(ethSold.toString(), 'Ether');
    weiSold = new BigNumber(weiSold);
    const weiSoldWithFee = weiSold.times(997);
    const numerator = weiSoldWithFee.times(tokenReserve);
    const denominator = weiReserve
      .minus(weiSold)
      .times(1000)
      .plus(weiSoldWithFee);
    const tokenBought = numerator.div(denominator);
    return tokenBought;
  }

  updateTokenBought(ethSold) {
    const tokenBought = this.getTokenBought(
      ethSold,
      this.props.uniswap.daiExchange.weiReserve,
      this.props.uniswap.daiExchange.daiReserve
    ).div(new RoundDownBigNumber(10).pow(18));
    this.setState({ tokenBought: tokenBought });
  }

  getMinTokens(tokenBought) {
    const minTokens = tokenBought.times(
      (100 - this.props.outgoingTransactionData.swap.slippage) / 100
    );
    return minTokens;
  }

  getDeadline() {
    const timestamp = Math.floor(Date.now() / 1000);
    const deadline = timestamp + 60 * 60;
    return deadline;
  }

  async constructTransactionObject() {
    const weiSold = parseFloat(Web3.utils.toWei(this.state.ethSold, 'Ether'));

    const minTokens = this.getMinTokens(this.state.tokenBought)
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

    const minTokensWithDecimals = this.state.tokenBought
      .times(new RoundDownBigNumber(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIUniswapContract)
      .setValue(weiSold.toString(16))
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.UniswapEthToTokenSwapInputGasLimit.toString(16))
      .tempSetData(ethToTokenSwapInputEncodedABI)
      .addTokenOperation('uniswap', TxStorage.TxTokenOpTypeToName.eth2tok, [
        this.props.checksumAddress,
        weiSold.toString(16),
        minTokensWithDecimals
      ]);
    return transactionObject;
  }

  validateForm = async () => {
    const ethSoldValidation = this.validateAmount(
      this.state.ethSold,
      GlobalConfig.UniswapEthToTokenSwapInputGasLimit
    );
    const isOnline = this.props.netInfo;

    if (ethSoldValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: false });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.saveOutgoingTransactionDataSwap({
        sold: this.state.ethSold,
        bought: this.state.tokenBought.toFixed(4),
        minBought: this.getMinTokens(this.state.tokenBought)
      });
      this.props.navigation.navigate('SwapConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  validateAmount(ethSold, gasLimit) {
    const weiBalance = new BigNumber(this.props.balance.wei);
    const weiSold = new BigNumber(Web3.utils.toWei(ethSold, 'Ether'));
    const transactionFeeLimitInWei = new BigNumber(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
    ).times(gasLimit);
    const tokenReserve = new BigNumber(
      this.props.uniswap.daiExchange.daiReserve,
      16
    );

    if (
      weiBalance.isGreaterThanOrEqualTo(
        weiSold.plus(transactionFeeLimitInWei)
      ) &&
      weiSold.isGreaterThanOrEqualTo(0) &&
      tokenReserve.isGreaterThanOrEqualTo(this.state.tokenBought)
    ) {
      LogUtilities.logInfo('the ethSold validated!');
      return true;
    }
    LogUtilities.logInfo('wrong balance!');
    return false;
  }

  updateEthSoldValidation(ethSoldValidation) {
    if (ethSoldValidation) {
      this.setState({
        ethSoldValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
    } else if (!ethSoldValidation) {
      this.setState({
        ethSoldValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
    }
  }

  renderTokenBoughtText() {
    if (this.state.tokenBought.toFixed() === '0') {
      return (
        <MinTokenBoughtGrayText>
          {this.getMinTokens(this.state.tokenBought).toFixed()}
        </MinTokenBoughtGrayText>
      );
    } else {
      return (
        <MinTokenBoughtBlackText>
          {this.getMinTokens(this.state.tokenBought).toFixed(4)}
        </MinTokenBoughtBlackText>
      );
    }
  }

  renderInsufficientBalanceMessage() {
    if (
      this.state.ethSoldValidation ||
      this.state.ethSoldValidation === undefined
    ) {
    } else {
      return <ErrorMessage>invalid amount!</ErrorMessage>;
    }
  }

  render() {
    let ethBalance = Web3.utils.fromWei(this.props.balance.wei);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);

    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t('swap')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          marginTop="24px"
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
                this.state.ethSoldValidation
              )}
              borderBottomWidth={1}
            >
              <SendTextInput
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={ethSold => {
                  if (ethSold) {
                    this.updateEthSoldValidation(
                      this.validateAmount(
                        ethSold,
                        GlobalConfig.UniswapEthToTokenSwapInputGasLimit
                      )
                    );
                    this.setState({ ethSold });
                    this.updateTokenBought(ethSold);
                  }
                }}
                returnKeyType="done"
              />
            </SwapForm>
              <BalanceText>{I18n.t('balance')}: {ethBalance}</BalanceText>
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
            <Title>you get at least</Title>
            {this.renderTokenBoughtText()}
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
        <AdvancedContainer
          gasLimit={GlobalConfig.UniswapEthToTokenSwapInputGasLimit}
          swap={true}
        />
        <ButtonWrapper>
          <Button
            text={I18n.t('button-next')}
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="40px auto"
            marginBottom="12px"
            opacity={this.state.buttonOpacity}
            onPress={async () => {
              await this.validateForm();
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

const MinTokenBoughtGrayText = styled.Text`
  color: #ccc;
  font-size: 28;
`;

const MinTokenBoughtBlackText = styled.Text`
  color: #000;
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

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 8;
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
    balance: state.ReducerBalance.balance,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    uniswap: state.ReducerUniswap.uniswap,
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    netInfo: state.ReducerNetInfo.netInfo,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionDataSwap,
  saveOutgoingTransactionObject
};

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
