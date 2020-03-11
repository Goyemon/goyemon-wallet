'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Web3 from 'web3';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveOutgoingDaiTransactionAmount } from '../actions/ActionOutgoingDaiTransactionData';
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
  InsufficientDaiBalanceMessage
} from '../components/common';
import NetworkFeeContainer from '../containers/NetworkFeeContainer';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class DepositDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      daiAmount: '',
      daiAmountValidation: undefined,
      ethAmountValidation: undefined,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5,
    };
  }

  componentDidMount() {
    this.validateEthAmount(this.returnTransactionSpeed(this.props.gasPrice.chosen));
  }

  componentDidUpdate(prevProps) {
    if (this.props.balance != prevProps.balance) {
      this.setState({ ethBalance: Web3.utils.fromWei(this.props.balance.weiBalance) });
    }
  }

  returnTransactionSpeed(chosenSpeed) {
    if(chosenSpeed === 0) {
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
    const daiAmount = this.state.daiAmount.split('.').join("");
    const decimalPlaces = TransactionUtilities.decimalPlaces(this.state.daiAmount);
    const decimals = 18 - parseInt(decimalPlaces);

    const mintEncodedABI = ABIEncoder.encodeCDAIMint(daiAmount, decimals);

    const daiAmountWithDecimals = new BigNumber(this.state.daiAmount).times(new BigNumber(10).pow(18)).toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(this.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16))
      .setGas((GlobalConfig.cTokenMintGasLimit).toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [TxStorage.storage.getOwnAddress(), daiAmountWithDecimals, 0]);

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
      GlobalConfig.cTokenMintGasLimit
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

  validateForm = async daiAmount => {
    const daiAmountValidation = this.validateDaiAmount(daiAmount);
    const ethAmountValidation = this.validateEthAmount(this.returnTransactionSpeed(this.props.gasPrice.chosen));
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && ethAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingDaiTransactionAmount(daiAmount);
      this.props.saveTransactionFeeEstimateEth(
        TransactionUtilities.getTransactionFeeEstimateInEther(
          this.returnTransactionSpeed(this.props.gasPrice.chosen),
          GlobalConfig.cTokenMintGasLimit
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            this.returnTransactionSpeed(this.props.gasPrice.chosen),
            GlobalConfig.cTokenMintGasLimit
          )
        )
      );
      this.props.navigation.navigate('DepositDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { cDaiLendingInfo } = this.props;
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
            borderColor={StyleUtilities.getBorderColor(this.state.daiAmountValidation)}
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
          <InsufficientDaiBalanceMessage daiAmountValidation={this.state.daiAmountValidation} />
          <NetworkFeeContainer gasLimit={GlobalConfig.cTokenMintGasLimit} />
          <InsufficientEthBalanceMessage ethAmountValidation={this.state.ethAmountValidation} />
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

const ButtonWrapper = styled.View`
  align-items: center;
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
  saveOutgoingDaiTransactionAmount
};

export default connect(mapStateToProps, mapDispatchToProps)(DepositDai);
