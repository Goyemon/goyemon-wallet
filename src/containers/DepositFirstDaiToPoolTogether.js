'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveOutgoingTransactionDataPoolTogether } from '../actions/ActionOutgoingTransactionData';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../actions/ActionModal';
import {
  RootContainer,
  GoyemonText,
  UseMaxButton,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  TxNextButton
} from '../components/common';
import Countdown from './common/Countdown';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import { AdvancedContainer } from './common/AdvancedContainer';
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
      loading: false
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
      .setTo(GlobalConfig.DAIPoolTogetherContractV2)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.PoolTogetherDepositPoolGasLimit.toString(16))
      .tempSetData(depositPoolEncodedABI)
      .addTokenOperation(
        'pooltogether',
        TxStorage.TxTokenOpTypeToName.PTdeposited,
        [TxStorage.storage.getOwnAddress(), daiAmountWithDecimals]
      );

    return transactionObject.setNonce(transactionObject.getNonce() + 1);
  }

  updateDaiAmountValidation(daiAmountValidation) {
    if (daiAmountValidation) {
      this.setState({
        daiAmountValidation: true
      });
    } else if (!daiAmountValidation) {
      this.setState({
        daiAmountValidation: false
      });
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if (weiAmountValidation) {
      this.setState({
        weiAmountValidation: true
      });
    } else if (!weiAmountValidation) {
      this.setState({
        weiAmountValidation: false
      });
    }
  }

  validateForm = async (daiAmount) => {
    const gasLimit =
      GlobalConfig.ERC20ApproveGasLimit +
      GlobalConfig.PoolTogetherDepositPoolGasLimit;
    const daiAmountValidation = TransactionUtilities.validateDaiPoolTogetherDepositAmount(
      daiAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      gasLimit
    );
    const isOnline = this.props.isOnline;

    if (daiAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const approveTransactionObject = await TransactionUtilities.constructApproveTransactionObject(
        GlobalConfig.DAIPoolTogetherContractV2,
        this.props.gasChosen
      );
      const depositPoolTransactionObject = await this.constructDepositPoolTransactionObject();
      await this.props.saveOutgoingTransactionDataPoolTogether({
        amount: daiAmount,
        gasLimit: gasLimit,
        approveTransactionObject: approveTransactionObject,
        transactionObject: depositPoolTransactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('pool-together-approve');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { balance } = this.props;
    const isOnline = this.props.isOnline;
    const daiBalance = RoundDownBigNumber(balance.dai)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    const daiFullBalance = RoundDownBigNumber(balance.dai)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(0);

    return (
      <RootContainer>
        <TxConfirmationModal />
        <HeaderOne marginTop="96">{I18n.t('deposit')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="240px"
          justifyContent="center"
          marginTop="56"
          textAlign="center"
          width="90%"
        >
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <Title>{I18n.t('dai-wallet-balance')}</Title>
          <Value>{daiBalance} DAI</Value>
          <Title>until the open round ends</Title>
          <Countdown />
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
                TransactionUtilities.validateDaiPoolTogetherDepositAmount(
                  daiFullBalance
                )
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
                  TransactionUtilities.validateDaiPoolTogetherDepositAmount(
                    daiAmount
                  )
                );
                this.setState({ daiAmount });
              }}
              returnKeyType="done"
              value={this.state.daiAmount}
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
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
          <TxNextButton
            disabled={
              !(
                this.state.daiAmountValidation &&
                this.state.weiAmountValidation &&
                isOnline
              ) || this.state.loading
                ? true
                : false
            }
            opacity={
              this.state.daiAmountValidation &&
              this.state.weiAmountValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(this.state.daiAmount);
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
    isOnline: state.ReducerNetInfo.isOnline
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionDataPoolTogether,
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositFirstDaiToPoolTogether);
