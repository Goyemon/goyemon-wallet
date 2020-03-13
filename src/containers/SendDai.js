'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import {
  saveOutgoingDaiTransactionAmount,
  saveOutgoingDaiTransactionToAddress
} from '../actions/ActionOutgoingDaiTransactionData';
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
  IsOnlineMessage,
  InsufficientEthBalanceMessage,
  InvalidToAddressMessage,
  InsufficientDaiBalanceMessage
} from '../components/common';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import HomeStack from '../navigators/HomeStack';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class SendDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress: '',
      amount: '',
      toAddressValidation: undefined,
      daiAmountValidation: undefined,
      weiAmountValidation: undefined,
      currency: 'USD',
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
    };
  }

  componentDidMount() {
    this.validateWeiAmountForTransactionFee(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen), GlobalConfig.ERC20TransferGasLimit);
  }

  componentDidUpdate(prevProps) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
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

    const amountWithDecimals = new BigNumber(this.state.amount).times(new BigNumber(10).pow(18)).toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAITokenContract)
      .setGasPrice(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16))
      .setGas((GlobalConfig.ERC20TransferGasLimit).toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.transfer, [TxStorage.storage.getOwnAddress(), GlobalConfig.DAITokenContract, amountWithDecimals]);

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

  validateWeiAmountForTransactionFee(gasPriceWei, gasLimit) {
    const weiBalance = new BigNumber(this.props.balance.weiBalance);
    const transactionFeeLimitInWei = new BigNumber(gasPriceWei).times(gasLimit);

    if (weiBalance.isGreaterThan(transactionFeeLimitInWei)) {
      LogUtilities.logInfo('the wei amount validated!');
      this.setState({ weiAmountValidation: true });
      return true;
    }
    LogUtilities.logInfo('wrong wei balance!');
    this.setState({ weiAmountValidation: false });
    return false;
  }

  validateForm = async (toAddress, amount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const daiAmountValidation = this.validateDaiAmount(amount);
    const weiAmountValidation = this.validateWeiAmountForTransactionFee(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen), GlobalConfig.ERC20TransferGasLimit);
    const isOnline = this.props.netInfo;

    if (
      toAddressValidation &&
      daiAmountValidation &&
      weiAmountValidation &&
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
          TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen),
          GlobalConfig.ERC20TransferGasLimit
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen),
            GlobalConfig.ERC20TransferGasLimit
          )
        )
      );

      this.props.navigation.navigate('SendDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

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
          <NetworkFeeContainer gasLimit={GlobalConfig.ERC20TransferGasLimit} />
          <InsufficientEthBalanceMessage weiAmountValidation={this.state.weiAmountValidation} />
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
            <Loader animating={this.state.loading} size="small"/>
          </ButtonWrapper>
          <IsOnlineMessage netInfo={this.props.netInfo} />
      </RootContainer>
    );
  }
}

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
  clearQRCodeData
};

export default connect(mapStateToProps, mapDispatchToProps)(SendDai);
