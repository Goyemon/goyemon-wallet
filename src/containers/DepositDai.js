'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveOutgoingTransactionDataCompound } from '../actions/ActionOutgoingTransactionData';
import {
  RootContainer,
  Button,
  UseMaxButton,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientEthBalanceMessage,
  InsufficientDaiBalanceMessage
} from '../components/common';
import AdvancedContainer from './AdvancedContainer';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class DepositDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiAmount: '',
      daiAmountValidation: undefined,
      weiAmountValidation: undefined,
      loading: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    };
  }

  componentDidMount() {
    this.updateWeiAmountValidation(
      TransactionUtilities.validateWeiAmountForTransactionFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.cTokenMintGasLimit
      )
    );
  }

  async constructTransactionObject() {
    const daiAmount = this.state.daiAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const mintEncodedABI = ABIEncoder.encodeCDAIMint(daiAmount, decimals);

    const daiAmountWithDecimals = new BigNumber(this.state.daiAmount)
      .times(new BigNumber(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.cTokenMintGasLimit.toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [
        TxStorage.storage.getOwnAddress(),
        daiAmountWithDecimals,
        0
      ]);

    return transactionObject;
  }

  updateDaiAmountValidation(daiAmountValidation) {
    if (daiAmountValidation) {
      this.setState({
        daiAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
    } else if (!daiAmountValidation) {
      this.setState({
        daiAmountValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if (weiAmountValidation) {
      this.setState({ weiAmountValidation: true });
    } else if (!weiAmountValidation) {
      this.setState({ weiAmountValidation: false });
    }
  }

  validateForm = async daiAmount => {
    const daiAmountValidation = TransactionUtilities.validateDaiAmount(
      daiAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.cTokenMintGasLimit
    );
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingTransactionDataCompound({
        amount: daiAmount
      });
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

    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);

    const daiFullBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Deposit</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="200px"
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
        <DepositAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            Deposit Amount
          </FormHeader>
          <UseMaxButton
            text="USE MAX"
            textColor="#00A3E2"
            onPress={() => {
              this.setState({ daiAmount: daiFullBalance });
              this.updateDaiAmountValidation(
                TransactionUtilities.validateDaiAmount(daiFullBalance)
              );
            }}
          />
        </DepositAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.daiAmountValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="amount"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={daiAmount => {
                this.updateDaiAmountValidation(
                  TransactionUtilities.validateDaiAmount(daiAmount)
                );
                this.setState({ daiAmount });
              }}
              returnKeyType="done"
              value={this.state.daiAmount}
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <InsufficientDaiBalanceMessage
          daiAmountValidation={this.state.daiAmountValidation}
        />
        <AdvancedContainer gasLimit={GlobalConfig.cTokenMintGasLimit} />
        <InsufficientEthBalanceMessage
          weiAmountValidation={this.state.weiAmountValidation}
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
              await this.validateForm(this.state.daiAmount);
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

const DepositAmountHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 80%;
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    balance: state.ReducerBalance.balance,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveOutgoingTransactionDataCompound
};

export default connect(mapStateToProps, mapDispatchToProps)(DepositDai);
