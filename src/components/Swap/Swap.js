'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionDataSwap } from '../../actions/ActionOutgoingTransactionData';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../../actions/ActionModal';
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
} from '../common';
import { AdvancedContainer } from '../AdvancedContainer';
import TxConfirmationModal from '../TxConfirmationModal';
import I18n from '../../i18n/I18n';
import ABIEncoder from '../../utilities/AbiUtilities';
import { RoundDownBigNumberPlacesEighteen } from '../../utilities/BigNumberUtilities';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';
import TxStorage from '../../lib/tx.js';
import GlobalConfig from '../../config.json';

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ETHBalance: Web3.utils.fromWei(props.balance.wei),
      ETHSold: '',
      tokenBought: new RoundDownBigNumberPlacesEighteen(0),
      ETHSoldValidation: undefined,
      loading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.balance != prevProps.balance) {
      this.setState({
        ETHBalance: Web3.utils.fromWei(this.props.balance.wei)
      });
    }
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateEthSoldValidation(this.validateAmount(this.state.ETHSold));
    }
  }

  getTokenBought(ETHSold, WEIReserve, tokenReserve) {
    WEIReserve = new RoundDownBigNumberPlacesEighteen(WEIReserve, 16);
    tokenReserve = new RoundDownBigNumberPlacesEighteen(tokenReserve, 16);
    let WEISold = Web3.utils.toWei(ETHSold.toString());
    WEISold = new RoundDownBigNumberPlacesEighteen(WEISold);
    const WEISoldWithFee = WEISold.times(997);
    const numerator = WEISoldWithFee.times(tokenReserve);
    const denominator = WEIReserve.times(1000).plus(WEISoldWithFee);
    const tokenBought = numerator.div(denominator);
    return tokenBought;
  }

  updateTokenBought(ETHSold) {
    if (TransactionUtilities.isNumber(ETHSold)) {
      const tokenBought = this.getTokenBought(
        ETHSold,
        this.props.uniswap.daiExchange.weiReserve,
        this.props.uniswap.daiExchange.daiReserve
      ).div(new RoundDownBigNumberPlacesEighteen(10).pow(18));
      this.setState({ tokenBought });
    } else {
      LogUtilities.logInfo('ETHSold is not a number');
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
    const hexWEI = TransactionUtilities.ETHToHexWEI(this.state.ETHSold);
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
      .setValue(hexWEI)
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
          hexWEI,
          minTokensWithDecimals,
          '0',
          this.props.checksumAddress
        ]
      );
    return transactionObject;
  }

  validateForm = async () => {
    const ETHSoldValidation = this.validateAmount(this.state.ETHSold);
    const isOnline = this.props.isOnline;

    if (ETHSoldValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataSwap({
        sold: this.state.ETHSold,
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

  validateAmount(ETHSold) {
    const WEIBalance = new RoundDownBigNumberPlacesEighteen(
      this.props.balance.wei
    );
    const WEISold = new RoundDownBigNumberPlacesEighteen(
      Web3.utils.toWei(ETHSold)
    );
    const maxNetworkFeeInWEI = new RoundDownBigNumberPlacesEighteen(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
    ).times(GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit);
    const tokenReserve = new RoundDownBigNumberPlacesEighteen(
      this.props.uniswap.daiExchange.daiReserve,
      16
    );

    if (
      WEIBalance.isGreaterThanOrEqualTo(WEISold.plus(maxNetworkFeeInWEI)) &&
      WEISold.isGreaterThanOrEqualTo(0) &&
      tokenReserve.isGreaterThanOrEqualTo(this.state.tokenBought)
    ) {
      LogUtilities.logInfo('the ETHSold validated!');
      return true;
    }
    LogUtilities.logInfo('wrong balance!');
    return false;
  }

  updateEthSoldValidation(ETHSoldValidation) {
    const isOnline = this.props.isOnline;
    if (ETHSoldValidation && isOnline) {
      this.setState({
        ETHSoldValidation: true
      });
    } else if (!ETHSoldValidation || !isOnline) {
      this.setState({
        ETHSoldValidation: false
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
      this.state.ETHSoldValidation ||
      this.state.ETHSoldValidation === undefined
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
    let ETHBalance = Web3.utils.fromWei(this.props.balance.wei);
    ETHBalance = RoundDownBigNumberPlacesEighteen(ETHBalance).toFixed(4);

    let WEIMaxAmount;
    const WEIBalance = new RoundDownBigNumberPlacesEighteen(
      this.props.balance.wei
    );
    const maxNetworkFee = new RoundDownBigNumberPlacesEighteen(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
    ).times(GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit);

    if (WEIBalance.isLessThanOrEqualTo(maxNetworkFee)) {
      WEIMaxAmount = '0';
    } else if (WEIBalance.isGreaterThan(maxNetworkFee)) {
      WEIMaxAmount = WEIBalance.minus(maxNetworkFee).toString();
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
                this.state.ETHSoldValidation
              )}
              borderBottomWidth={1}
            >
              <SendTextInput
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={(ETHSold) => {
                  this.setState({ ETHSold });
                  if (
                    TransactionUtilities.isNumber(ETHSold) &&
                    TransactionUtilities.isLessThan18Digits(ETHSold)
                  ) {
                    this.updateEthSoldValidation(this.validateAmount(ETHSold));
                    this.updateTokenBought(ETHSold);
                  } else {
                    this.updateEthSoldValidation(false);
                  }
                }}
                returnKeyType="done"
                value={this.state.ETHSold}
              />
            </SwapForm>
            <View>{this.renderInsufficientBalanceMessage()}</View>
            <UseMaxButton
              text={I18n.t('use-max')}
              textColor="#00A3E2"
              onPress={() => {
                this.setState({
                  ETHSold: Web3.utils.fromWei(WEIMaxAmount)
                });
                this.updateEthSoldValidation(
                  TransactionUtilities.hasSufficientWeiForAmount(
                    WEIMaxAmount,
                    GlobalConfig.UniswapV2SwapExactETHForTokensGasLimit
                  )
                );
                this.updateTokenBought(Web3.utils.fromWei(WEIMaxAmount));
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
              <CoinImage source={require('../../../assets/ether_icon.png')} />
              <CurrencySymbolText>ETH</CurrencySymbolText>
            </CurrencyContainer>
            <BalanceText>
              {I18n.t('balance')}: {ETHBalance}
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
          <Icon name="arrow-down-bold" size={40} color="#5F5F5F" />
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
            <CoinImage source={require('../../../assets/dai_icon.png')} />
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
              !(this.state.ETHSoldValidation && isOnline) || this.state.loading
            }
            opacity={this.state.ETHSoldValidation && isOnline ? 1 : 0.5}
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
