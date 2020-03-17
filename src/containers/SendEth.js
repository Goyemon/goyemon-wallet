'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { clearQRCodeData } from '../actions/ActionQRCodeData';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InvalidToAddressMessage,
  ErrorMessage
} from '../components/common';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import HomeStack from '../navigators/HomeStack';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class SendEth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      toAddress: '',
      ethAmount: '',
      toAddressValidation: undefined,
      amountValidation: undefined,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
    }
  }

  async constructTransactionObject() {
    const amountWei = parseFloat(Web3.utils.toWei(this.state.ethAmount, 'Ether'));// TODO: why is it here?

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(this.state.toAddress)
      .setValue(amountWei.toString(16))
      .setGasPrice(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16))
      .setGas((GlobalConfig.ETHTxGasLimit).toString(16));

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

  validateAmount(ethAmount, gasLimit) {
    const weiBalance = new BigNumber(this.props.balance.weiBalance);
    const weiAmount = new BigNumber(Web3.utils.toWei(ethAmount, 'Ether')); 
    const transactionFeeLimitInWei = new BigNumber(TransactionUtilities.returnTransactionSpeed(this.props.gasPrice.chosen)).times(gasLimit);

    if (
      weiBalance.isGreaterThanOrEqualTo(
        weiAmount.plus(transactionFeeLimitInWei)
      ) &&
      weiAmount.isGreaterThanOrEqualTo(0)
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

  validateForm = async (toAddress, ethAmount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const amountValidation = this.validateAmount(ethAmount, GlobalConfig.ETHTxGasLimit);
    const isOnline = this.props.netInfo;

    if (toAddressValidation && amountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.navigation.navigate('SendEthConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const ethBalance = RoundDownBigNumber(this.state.ethBalance).toFixed(4);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Send</HeaderOne>
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
            borderColor={StyleUtilities.getBorderColor(this.state.amountValidation)}
            borderWidth={1}
            height="56px"
          >
            <SendTextInputContainer>
              <SendTextInput
                placeholder="0"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={ethAmount => {
                  this.validateAmount(ethAmount, GlobalConfig.ETHTxGasLimit);
                  this.setState({ ethAmount });
                }}
                returnKeyType="done"
              />
              <CurrencySymbolText>ETH</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <View>{this.renderInsufficientBalanceMessage()}</View>
          <NetworkFeeContainer gasLimit={GlobalConfig.ETHTxGasLimit}/>
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
                  this.state.ethAmount
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

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    balance: state.ReducerBalance.balance,
    netInfo: state.ReducerNetInfo.netInfo,
    qrCodeData: state.ReducerQRCodeData.qrCodeData,
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  clearQRCodeData
};

export default connect(mapStateToProps, mapDispatchToProps)(SendEth);
