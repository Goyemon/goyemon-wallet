'use strict';
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
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  TxNextButton,
  UseMaxButton
} from '../components/common';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import { AdvancedContainer } from './common/AdvancedContainer';
import I18n from '../i18n/I18n';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class WithdrawDaiFromPoolTogether extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pooltogetherDaiBalance: RoundDownBigNumberPlacesFour(
        props.balance.pooltogetherDai.open
      )
        .plus(props.balance.pooltogetherDai.committed)
        .plus(props.balance.pooltogetherDai.sponsored)
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(0),
      daiWithdrawAmount: '',
      daiWithdrawAmountValidation: undefined,
      weiAmountValidation: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.updateWeiAmountValidation(
      TransactionUtilities.validateWeiAmountForTransactionFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.PoolTogetherWithdrawGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.validateWeiAmountForTransactionFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.PoolTogetherWithdrawGasLimit
        )
      );
    }
    if (
      this.props.balance.pooltogetherDai != prevProps.balance.pooltogetherDai
    ) {
      this.setState({
        pooltogetherDaiBalance: RoundDownBigNumberPlacesFour(
          this.props.balance.pooltogetherDai.open
        )
          .plus(this.props.balance.pooltogetherDai.committed)
          .plus(this.props.balance.pooltogetherDai.sponsored)
          .div(new RoundDownBigNumberPlacesFour(10).pow(18))
          .toFixed(0)
      });
    }
  }

  async constructTransactionObject() {
    const daiWithdrawAmount = this.state.daiWithdrawAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiWithdrawAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const withdrawEncodedABI = ABIEncoder.encodeWithdraw(
      daiWithdrawAmount,
      decimals
    );

    const daiWithdrawAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(
      this.state.daiWithdrawAmount
    )
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAIPoolTogetherContractV2)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.PoolTogetherWithdrawGasLimit.toString(16))
      .tempSetData(withdrawEncodedABI)
      .addTokenOperation(
        'pooltogether',
        TxStorage.TxTokenOpTypeToName.PTwithdrawn,
        [TxStorage.storage.getOwnAddress(), daiWithdrawAmountWithDecimals]
      );

    return transactionObject;
  }

  updateDaiWithdrawAmountValidation(daiWithdrawAmountValidation) {
    if (daiWithdrawAmountValidation) {
      this.setState({
        daiWithdrawAmountValidation: true
      });
    } else if (!daiWithdrawAmountValidation) {
      this.setState({
        daiWithdrawAmountValidation: false
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

  validateForm = async (daiWithdrawAmount) => {
    const daiWithdrawAmountValidation = TransactionUtilities.validateDaiPoolTogetherWithdrawAmount(
      daiWithdrawAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.PoolTogetherWithdrawGasLimit
    );
    const isOnline = this.props.isOnline;

    if (daiWithdrawAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataPoolTogether({
        amount: daiWithdrawAmount,
        gasLimit: GlobalConfig.PoolTogetherWithdrawGasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('pool-together-withdraw');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const isOnline = this.props.isOnline;

    return (
      <RootContainer>
        <TxConfirmationModal />
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
          <Title>dai pooltogether balance</Title>
          <Value>{this.state.pooltogetherDaiBalance}DAI</Value>
        </UntouchableCardContainer>
        <WithDrawAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('withdraw-amount')}
          </FormHeader>
          <UseMaxButton
            text={I18n.t('use-max')}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({
                daiWithdrawAmount: this.state.pooltogetherDaiBalance
              });
              this.updateDaiWithdrawAmountValidation(
                TransactionUtilities.validateDaiPoolTogetherWithdrawAmount(
                  this.state.pooltogetherDaiBalance
                )
              );
            }}
          />
        </WithDrawAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.daiWithdrawAmountValidation
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
                this.updateDaiWithdrawAmountValidation(
                  TransactionUtilities.validateDaiPoolTogetherWithdrawAmount(
                    daiWithdrawAmount
                  )
                );
                this.setState({ daiWithdrawAmount });
              }}
              returnKeyType="done"
              value={this.state.daiWithdrawAmount}
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AdvancedContainer
          gasLimit={GlobalConfig.PoolTogetherWithdrawGasLimit}
        />
        <InsufficientWeiBalanceMessage
          weiAmountValidation={this.state.weiAmountValidation}
        />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(
                this.state.daiWithdrawAmountValidation &&
                this.state.weiAmountValidation &&
                isOnline
              ) || this.state.loading
            }
            opacity={
              this.state.daiWithdrawAmountValidation &&
              this.state.weiAmountValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(this.state.daiWithdrawAmount);
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
)(WithdrawDaiFromPoolTogether);
