'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionDataSwap } from '../actions/ActionOutgoingTransactionData';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../actions/ActionModal';
import {
  RootContainer,
  Container,
  UntouchableCardContainer,
  HeaderOne,
  GoyemonText,
  SwapForm,
  Loader,
  IsOnlineMessage,
  ErrorMessage,
  TxNextButton,
  UseMaxButton
} from '../components/common';
import { AdvancedContainer } from '../containers/common/AdvancedContainer';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import I18n from '../i18n/I18n';
import ABIEncoder from '../utilities/AbiUtilities';
import { RoundDownBigNumberPlacesEighteen } from '../utilities/BigNumberUtilities';
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
      tokenBought: new RoundDownBigNumberPlacesEighteen(0),
      ethSoldValidation: undefined,
      loading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.balance != prevProps.balance) {
      this.setState({
        ethBalance: Web3.utils.fromWei(this.props.balance.wei)
      });
    }
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateEthSoldValidation(this.validateAmount(this.state.ethSold));
    }
  }

  getTokenBought(ethSold, weiReserve, tokenReserve) {
    weiReserve = new RoundDownBigNumberPlacesEighteen(weiReserve, 16);
    tokenReserve = new RoundDownBigNumberPlacesEighteen(tokenReserve, 16);
    let weiSold = Web3.utils.toWei(ethSold.toString());
    weiSold = new RoundDownBigNumberPlacesEighteen(weiSold);
    const weiSoldWithFee = weiSold.times(997);
    const numerator = weiSoldWithFee.times(tokenReserve);
    const denominator = weiReserve.times(1000).plus(weiSoldWithFee);
    const tokenBought = numerator.div(denominator);
    return tokenBought;
  }

  updateTokenBought(ethSold) {
    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(ethSold);
    if (isNumber) {
      const tokenBought = this.getTokenBought(
        ethSold,
        this.props.uniswap.daiExchange.weiReserve,
        this.props.uniswap.daiExchange.daiReserve
      ).div(new RoundDownBigNumberPlacesEighteen(10).pow(18));
      this.setState({ tokenBought });
    } else {
      LogUtilities.logInfo('ethSold is not a number');
    }
  }

  getMinTokens(tokenBought) {
    const minTokens = tokenBought.times(
      new RoundDownBigNumberPlacesEighteen(100)
        .minus(
          new RoundDownBigNumberPlacesEighteen(
            this.props.uniswap.slippage[this.props.uniswap.slippageChosen].value
          )
        )
        .div(100)
    );
    return minTokens;
  }

  getDeadline() {
    const timestamp = Math.floor(Date.now() / 1000);
    const deadline = timestamp + 60 * 60;
    return deadline;
  }

  async constructTransactionObject() {
    const hexWei = TransactionUtilities.etherToHexWei(this.state.ethSold);
    const minTokens = this.getMinTokens(this.state.tokenBought)
      .toString(10)
      .split('.')
      .join('');
    const path = [
      GlobalConfig.WETHTokenContract,
      GlobalConfig.DAITokenContract
    ];
    const deadline = this.getDeadline();
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.getMinTokens(this.state.tokenBought).toString(10)
    );

    const decimals = 18 - parseInt(decimalPlaces);

    const swapExactETHForTokensEncodedABI = ABIEncoder.encodeSwapExactETHForTokens(
      minTokens,
      path,
      this.props.checksumAddress,
      deadline,
      decimals
    );

    const minTokensWithDecimals = this.state.tokenBought
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.RouterUniswapV2)
      .setValue(hexWei)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit.toString(16))
      .tempSetData(swapExactETHForTokensEncodedABI)
      .addTokenOperation(
        'uniswap2ethdai',
        TxStorage.TxTokenOpTypeToName.U2swap,
        [
          GlobalConfig.RouterUniswapV2,
          '0',
          hexWei,
          minTokensWithDecimals,
          '0',
          this.props.checksumAddress
        ]
      );
    return transactionObject;
  }

  validateForm = async () => {
    const ethSoldValidation = this.validateAmount(this.state.ethSold);
    const isOnline = this.props.isOnline;

    if (ethSoldValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataSwap({
        sold: this.state.ethSold,
        bought: this.state.tokenBought.toFixed(4),
        minBought: this.getMinTokens(this.state.tokenBought),
        slippage: this.props.uniswap.slippage[this.props.uniswap.slippageChosen]
          .value,
        gasLimit: GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('swap');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  validateAmount(ethSold) {
    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(ethSold);
    if (isNumber) {
      const weiBalance = new RoundDownBigNumberPlacesEighteen(
        this.props.balance.wei
      );
      const weiSold = new RoundDownBigNumberPlacesEighteen(
        Web3.utils.toWei(ethSold)
      );
      const transactionFeeLimitInWei = new RoundDownBigNumberPlacesEighteen(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
      ).times(GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit);
      const tokenReserve = new RoundDownBigNumberPlacesEighteen(
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
    } else {
      return false;
    }
  }

  updateEthSoldValidation(ethSoldValidation) {
    const isOnline = this.props.isOnline;
    if (ethSoldValidation && isOnline) {
      this.setState({
        ethSoldValidation: true
      });
    } else if (!ethSoldValidation || !isOnline) {
      this.setState({
        ethSoldValidation: false
      });
    }
  }

  renderTokenBoughtText() {
    if (this.state.tokenBought.toFixed() === '0') {
      return <MinTokenBoughtGrayText>0</MinTokenBoughtGrayText>;
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
      return (
        <View>
          <ErrorMessage textAlign="left">invalid amount!</ErrorMessage>
          <GoyemonText fontSize="12px">
            *beware that network fee is paid with ether
          </GoyemonText>
        </View>
      );
    }
  }

  render() {
    const isOnline = this.props.isOnline;
    let ethBalance = Web3.utils.fromWei(this.props.balance.wei);
    ethBalance = RoundDownBigNumberPlacesEighteen(ethBalance).toFixed(4);

    let weiMaxAmount;
    const weiBalance = new RoundDownBigNumberPlacesEighteen(
      this.props.balance.wei
    );
    const networkFeeLimit = new RoundDownBigNumberPlacesEighteen(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
    ).times(GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit);

    if (weiBalance.isLessThanOrEqualTo(networkFeeLimit)) {
      weiMaxAmount = '0';
    } else if (weiBalance.isGreaterThan(networkFeeLimit)) {
      weiMaxAmount = weiBalance.minus(networkFeeLimit).toString();
    }

    return (
      <RootContainer>
        <TxConfirmationModal />
        <HeaderOne marginTop="64">{I18n.t('swap')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          marginTop="24px"
          textAlign="center"
          width="90%"
        >
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="center"
            marginTop={0}
            width="50%"
          >
            <Title>{I18n.t('swap-sell-title')}</Title>
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
                onChangeText={(ethSold) => {
                  this.setState({ ethSold });
                  this.updateEthSoldValidation(this.validateAmount(ethSold));
                  this.updateTokenBought(ethSold);
                }}
                returnKeyType="done"
                value={this.state.ethSold}
              />
            </SwapForm>
            <View>{this.renderInsufficientBalanceMessage()}</View>
            <UseMaxButton
              text={I18n.t('use-max')}
              textColor="#00A3E2"
              onPress={() => {
                this.setState({
                  ethSold: Web3.utils.fromWei(weiMaxAmount)
                });
                this.updateEthSoldValidation(
                  TransactionUtilities.validateWeiAmount(
                    weiMaxAmount,
                    GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit
                  )
                );
                this.updateTokenBought(Web3.utils.fromWei(weiMaxAmount));
              }}
            />
          </Container>
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="center"
            marginTop={0}
            width="50%"
          >
            <CurrencyContainer>
              <CoinImage source={require('../../assets/ether_icon.png')} />
              <CurrencySymbolText>ETH</CurrencySymbolText>
            </CurrencyContainer>
            <BalanceText>
              {I18n.t('balance')}: {ethBalance}
            </BalanceText>
          </Container>
        </UntouchableCardContainer>
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
          width="90%"
        >
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="center"
            marginTop={0}
            width="50%"
          >
            <Title>{I18n.t('swap-buy-title')}</Title>
            {this.renderTokenBoughtText()}
          </Container>
          <Container
            alignItems="center"
            flexDirection="row"
            justifyContent="flex-start"
            marginTop={0}
            width="50%"
          >
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </Container>
        </UntouchableCardContainer>
        <AdvancedContainer
          gasLimit={GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit}
          swap={true}
        />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(this.state.ethSoldValidation && isOnline) || this.state.loading
            }
            opacity={this.state.ethSoldValidation && isOnline ? 1 : 0.5}
            onPress={async () => {
              await this.validateForm();
              this.setState({ loading: false });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage isOnline={this.props.isOnline} />
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

const CurrencySymbolText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 28;
`;

const CurrencyContainer = styled.View`
  flex-direction: row;
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
    isOnline: state.ReducerNetInfo.isOnline,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
  saveOutgoingTransactionDataSwap
};

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
