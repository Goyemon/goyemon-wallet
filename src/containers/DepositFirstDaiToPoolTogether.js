'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveOutgoingTransactionObject } from '../actions/ActionOutgoingTransactionObjects';
import { saveOutgoingTransactionDataPoolTogether } from '../actions/ActionOutgoingTransactionData';
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

class DepositFirstDaiToPoolTogether extends Component {
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
        GlobalConfig.ERC20ApproveGasLimit +
          GlobalConfig.PoolTogetherDepositPoolGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.validateWeiAmountForTransactionFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.ERC20ApproveGasLimit +
            GlobalConfig.PoolTogetherDepositPoolGasLimit
        )
      );
    }
  }

  async constructDepositPoolTransactionObject() {
    const daiAmount = this.state.daiAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const depositPoolEncodedABI = ABIEncoder.encodeDepositPool(
      daiAmount,
      decimals
    );

    const daiAmountWithDecimals = new BigNumber(this.state.daiAmount)
      .times(new BigNumber(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIPoolTogetherContract)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.PoolTogetherDepositPoolGasLimit.toString(16))
      .tempSetData(depositPoolEncodedABI)
      .addTokenOperation(
        'poolTogether',
        TxStorage.TxTokenOpTypeToName.depositPool,
        [TxStorage.storage.getOwnAddress(), daiAmountWithDecimals]
      );

    return transactionObject.setNonce(transactionObject.getNonce() + 1);
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

  validateForm = async (daiAmount) => {
    const daiAmountValidation = TransactionUtilities.validateTicketAmount(
      daiAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.ERC20ApproveGasLimit +
        GlobalConfig.PoolTogetherDepositPoolGasLimit
    );
    const isOnline = this.props.netInfo;

    if (daiAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true, buttonDisabled: true });
      LogUtilities.logInfo('validation successful');
      const approveTransactionObject = await TransactionUtilities.constructApproveTransactionObject(
        GlobalConfig.DAIPoolTogetherContract,
        this.props.gasChosen
      );
      await this.props.saveOutgoingTransactionObject(approveTransactionObject);
      const depositPoolTransactionObject = await this.constructDepositPoolTransactionObject();
      await this.props.saveOutgoingTransactionObject(
        depositPoolTransactionObject
      );
      await this.props.saveOutgoingTransactionDataPoolTogether({
        amount: daiAmount
      });
      this.props.navigation.navigate(
        'DepositFirstDaiToPoolTogetherConfirmation'
      );
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  renderChanceOfWinning() {
    return <Text>You have a 1 in 536,100 chance of winning.</Text>;
  }

  render() {
    const { balance } = this.props;
    const daiBalance = RoundDownBigNumber(balance.dai)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    const daiFullBalance = RoundDownBigNumber(balance.dai)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(0);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">{I18n.t('deposit')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="200px"
          justifyContent="center"
          marginTop="56"
          textAlign="center"
          width="90%"
        >
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <Title>{I18n.t('dai-wallet-balance')}</Title>
          <Value>{daiBalance} DAI</Value>
          <Title>next prize(estimated)</Title>
          <Value>$</Value>
          <Title>time until the next prize</Title>
          <Value>days hours minutes</Value>
        </UntouchableCardContainer>
        <DepositAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('deposit-amount')}
          </FormHeader>
          <UseMaxButton
            text={I18n.t('use-max')}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({ daiAmount: daiFullBalance });
              this.updateDaiAmountValidation(
                TransactionUtilities.validateTicketAmount(daiFullBalance)
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
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(daiAmount) => {
                this.updateDaiAmountValidation(
                  TransactionUtilities.validateTicketAmount(daiAmount)
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
        {this.renderChanceOfWinning()}
        <AdvancedContainer
          gasLimit={
            GlobalConfig.ERC20ApproveGasLimit +
            GlobalConfig.PoolTogetherDepositPoolGasLimit
          }
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
  width: 90%;
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    gasChosen: state.ReducerGasPrice.gasChosen,
    gasPrice: state.ReducerGasPrice.gasPrice,
    netInfo: state.ReducerNetInfo.netInfo
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionObject,
  saveOutgoingTransactionDataPoolTogether
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositFirstDaiToPoolTogether);
