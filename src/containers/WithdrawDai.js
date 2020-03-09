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

class WithdrawDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.weiBalance),
      daiWithdrawAmount: '',
      daiSavingsAmountValidation: undefined,
      ethAmountValidation: undefined,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
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
    const daiWithdrawAmount = this.state.daiWithdrawAmount.split('.').join("");
    const decimalPlaces = TransactionUtilities.decimalPlaces(this.state.daiWithdrawAmount);
    const decimals = 18 - parseInt(decimalPlaces);

    const redeemUnderlyingEncodedABI = ABIEncoder.encodeCDAIRedeemUnderlying(
      daiWithdrawAmount, decimals
    );

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(this.returnTransactionSpeed(this.props.gasPrice.chosen).toString(16))
      .setGas((GlobalConfig.cTokenRedeemUnderlyingGasLimit).toString(16))
      .tempSetData(redeemUnderlyingEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.redeem, [TxStorage.storage.getOwnAddress(), daiWithdrawAmount, 0]); // Web3.utils.toBN(daiWithdrawAmount).mul(new web3.utils.BN(10).pow(new web3.utils.BN(18))).toString(16)

    return transactionObject;
  }

  validateDaiSavingsAmount(daiWithdrawAmount) {
    daiWithdrawAmount = new BigNumber(10).pow(36).times(daiWithdrawAmount);
    const daiSavingsBalance = new BigNumber(
      this.props.balance.daiSavingsBalance
    );

    if (
      daiSavingsBalance.isGreaterThanOrEqualTo(daiWithdrawAmount) &&
      daiWithdrawAmount.isGreaterThanOrEqualTo(0)
    ) {
      LogUtilities.logInfo('the dai savings amount validated!');
      this.setState({
        daiSavingsAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
      return true;
    }
    LogUtilities.logInfo('wrong dai balance!');
    this.setState({
      daiSavingsAmountValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
    return false;
  }

  validateEthAmount(gasPriceWei) {
    let transactionFeeLimitInEther = TransactionUtilities.getTransactionFeeEstimateInEther(
      gasPriceWei,
      GlobalConfig.cTokenRedeemUnderlyingGasLimit
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

  validateForm = async daiWithdrawAmount => {
    const daiSavingsAmountValidation = this.validateDaiSavingsAmount(
      daiWithdrawAmount
    );
    const ethAmountValidation = this.validateEthAmount(this.returnTransactionSpeed(this.props.gasPrice.chosen));
    const isOnline = this.props.netInfo;

    if (daiSavingsAmountValidation && ethAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingDaiTransactionAmount(daiWithdrawAmount);
      this.props.saveTransactionFeeEstimateEth(
        TransactionUtilities.getTransactionFeeEstimateInEther(
          this.returnTransactionSpeed(this.props.gasPrice.chosen),
          GlobalConfig.cTokenRedeemUnderlyingGasLimit
        )
      );
      this.props.saveTransactionFeeEstimateUsd(
        PriceUtilities.convertEthToUsd(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            this.returnTransactionSpeed(this.props.gasPrice.chosen),
            GlobalConfig.cTokenRedeemUnderlyingGasLimit
          )
        )
      );
      this.props.navigation.navigate('WithdrawDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(new BigNumber(10).pow(36))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Withdraw</HeaderOne>
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
          <Form
            borderColor={StyleUtilities.getBorderColor(this.state.daiSavingsAmountValidation)}
            borderWidth={1}
            height="56px"
          >
            <SendTextInputContainer>
              <SendTextInput
                placeholder="amount"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                onChangeText={daiWithdrawAmount => {
                  this.validateDaiSavingsAmount(daiWithdrawAmount);
                  this.setState({ daiWithdrawAmount });
                }}
                returnKeyType="done"
              />
              <CurrencySymbolText>DAI</CurrencySymbolText>
            </SendTextInputContainer>
          </Form>
          <InsufficientDaiBalanceMessage daiAmountValidation={this.state.daiAmountValidation} />
          <NetworkFeeContainer gasLimit={GlobalConfig.cTokenRedeemUnderlyingGasLimit} />
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
                await this.validateForm(this.state.daiWithdrawAmount);
                this.setState({ loading: false, buttonDisabled: false });
              }}
            />
            <Loader animating={this.state.loading} />
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
    balance: state.ReducerBalance.balance,
    gasPrice: state.ReducerGasPrice.gasPrice,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveTransactionFeeEstimateUsd,
  saveTransactionFeeEstimateEth,
  saveOutgoingDaiTransactionAmount
};

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawDai);
