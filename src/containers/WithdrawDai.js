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
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  InsufficientDaiBalanceMessage
} from '../components/common';
import AdvancedContainer from './AdvancedContainer';
import I18n from '../i18n/I18n';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class WithdrawDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiWithdrawAmount: '',
      daiSavingsAmountValidation: undefined,
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
        GlobalConfig.cTokenRedeemUnderlyingGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.validateWeiAmountForTransactionFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.cTokenRedeemUnderlyingGasLimit
        )
      );
    }
  }

  async constructTransactionObject() {
    const daiWithdrawAmount = this.state.daiWithdrawAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiWithdrawAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const redeemUnderlyingEncodedABI = ABIEncoder.encodeCDAIRedeemUnderlying(
      daiWithdrawAmount,
      decimals
    );

    const daiWithdrawAmountWithDecimals = new BigNumber(
      this.state.daiWithdrawAmount
    )
      .times(new BigNumber(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.cTokenRedeemUnderlyingGasLimit.toString(16))
      .tempSetData(redeemUnderlyingEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.redeem, [
        TxStorage.storage.getOwnAddress(),
        daiWithdrawAmountWithDecimals,
        0
      ]);

    return transactionObject;
  }

  updateDaiSavingsAmountValidation(daiSavingsAmountValidation) {
    if (daiSavingsAmountValidation) {
      this.setState({
        daiSavingsAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
    } else if (!daiSavingsAmountValidation) {
      this.setState({
        daiSavingsAmountValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if (weiAmountValidation) {
      this.setState({
        weiAmountValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
    } else if (!weiAmountValidation) {
      this.setState({
        weiAmountValidation: false,
        buttonDisabled: true,
        buttonOpacity: 0.5
      });
    }
  }

  validateForm = async (daiWithdrawAmount) => {
    const daiSavingsAmountValidation = TransactionUtilities.validateDaiCompoundWithdrawAmount(
      daiWithdrawAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.cTokenRedeemUnderlyingGasLimit
    );
    const isOnline = this.props.netInfo;

    if (daiSavingsAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      await this.props.saveOutgoingTransactionObject(transactionObject);
      await this.props.saveOutgoingTransactionDataCompound({
        amount: daiWithdrawAmount
      });
      this.props.navigation.navigate('WithdrawDaiConfirmation');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;

    const compoundDaiBalance = RoundDownBigNumber(balance.compoundDai)
      .div(new RoundDownBigNumber(10).pow(36))
      .toFixed(2);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">{I18n.t('withdraw')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="160px"
          justifyContent="center"
          marginTop="56"
          textAlign="center"
          width="90%"
        >
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <Title>dai savings</Title>
          <Value>{compoundDaiBalance} DAI</Value>
        </UntouchableCardContainer>
        <WithDrawAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('withdraw-amount')}
          </FormHeader>
        </WithDrawAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.daiSavingsAmountValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(daiWithdrawAmount) => {
                this.updateDaiSavingsAmountValidation(
                  TransactionUtilities.validateDaiCompoundWithdrawAmount(
                    daiWithdrawAmount
                  )
                );
                this.setState({ daiWithdrawAmount });
              }}
              returnKeyType="done"
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <InsufficientDaiBalanceMessage
          daiAmountValidation={this.state.daiAmountValidation}
        />
        <AdvancedContainer
          gasLimit={GlobalConfig.cTokenRedeemUnderlyingGasLimit}
        />
        <InsufficientWeiBalanceMessage
          weiAmountValidation={this.state.weiAmountValidation}
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
              await this.validateForm(this.state.daiWithdrawAmount);
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
  width: 100%;
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

const WithDrawAmountHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveOutgoingTransactionDataCompound
};

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawDai);
