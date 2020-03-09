'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import {
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth
} from '../actions/ActionTransactionFeeEstimate';
import {
  RootContainer,
  Container,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  Loader,
  IsOnlineMessage,
  ErrorMessage
} from '../components/common';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
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
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.balance != prevProps.balance) {
      this.setState({
        ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance)
      });
    }
  }

  returnTransactionSpeed(chosenSpeed) {
    if (chosenSpeed === 0) {
      return this.props.gasPrice.fast;
    } else if (chosenSpeed === 1) {
      return this.props.gasPrice.average;
    } else if (chosenSpeed === 2) {
      return this.props.gasPrice.slow;
    } else {
      LogUtilities.logInfo('invalid transaction speed');
    }
  }

  async constructTransactionObject() {
    let minToken;
    let deadline;
    const ethToTokenSwapInputEncodedABI = ABIEncoder.encodeEthToTokenSwapInput(
      minToken,
      deadline
    );

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIUniswapContract)
      .setGasPrice(
        this.state.gasPrice[this.state.checked].gasPriceWei.toString(16)
      )
      .setGas(GlobalConfig.UniswapEthToTokenSwapInputGasLimit.toString(16))
      .tempSetData(ethToTokenSwapInputEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.eth2tok, [
        this.props.checksumAddress,
        this.state.amount,
        minToken,
        deadline
      ]);

    return transactionObject;
  }

  validateAmount(amount) {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      this.state.gasPrice[this.state.checked].gasPriceWei,
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

  validateForm = async amount => {
    const amountValidation = this.validateAmount(amount);
    const isOnline = this.props.netInfo;

    if (amountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      this.props.saveTransactionFeeEstimateEth(
        TransactionUtilities.getTransactionFeeEstimateInEther(
          this.state.gasPrice[this.state.checked].gasPriceWei,
          GlobalConfig.UniswapEthToTokenSwapInputGasLimit
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            this.state.gasPrice[this.state.checked].gasPriceWei,
            GlobalConfig.UniswapEthToTokenSwapInputGasLimit
          )
        )
      );
      this.props.navigation.navigate('SwapConfirmation');
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
            <Form
              borderColor={StyleUtilities.getBorderColor(
                this.state.amountValidation
              )}
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
              </SendTextInputContainer>
            </Form>
          </Container>
          <CoinImage source={require('../../assets/ether_icon.png')} />
          <CurrencySymbolText>ETH</CurrencySymbolText>
        </UntouchableCardContainer>
        <View>{this.renderInsufficientBalanceMessage()}</View>
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
              await this.validateForm(this.state.toAddress, this.state.amount);
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

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 28;
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

const CurrencySymbolText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
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

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth
};

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
