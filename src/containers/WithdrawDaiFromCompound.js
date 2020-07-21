'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveOutgoingTransactionDataCompound } from '../actions/ActionOutgoingTransactionData';
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
  TxNextButton
} from '../components/common';
import { AdvancedContainer } from './common/AdvancedContainer';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
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

class WithdrawDaiFromCompound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compoundDAIBalance: RoundDownBigNumberPlacesFour(
        props.balance.compoundDai
      )
        .div(new RoundDownBigNumberPlacesFour(10).pow(36))
        .toFixed(2),
      DAIWithdrawAmount: '',
      DAISavingsAmountValidation: undefined,
      WEIAmountValidation: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.updateWeiAmountValidation(
      TransactionUtilities.hasSufficientWEIForNetworkFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.cTokenRedeemUnderlyingGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.hasSufficientWEIForNetworkFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.cTokenRedeemUnderlyingGasLimit
        )
      );
    }
    if (this.props.balance.compoundDai != prevProps.balance.compoundDai) {
      this.setState({
        compoundDAIBalance: RoundDownBigNumberPlacesFour(
          this.props.balance.compoundDai
        )
          .div(new RoundDownBigNumberPlacesFour(10).pow(18))
          .toFixed(2)
      });
    }
  }

  async constructTransactionObject() {
    const DAIWithdrawAmount = this.state.DAIWithdrawAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.DAIWithdrawAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const redeemUnderlyingEncodedABI = ABIEncoder.encodeCDAIRedeemUnderlying(
      DAIWithdrawAmount,
      decimals
    );

    const DAIWithdrawAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(
      this.state.DAIWithdrawAmount
    )
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
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
        DAIWithdrawAmountWithDecimals,
        0
      ]);

    return transactionObject;
  }

  updateDaiSavingsAmountValidation(DAISavingsAmountValidation) {
    if (DAISavingsAmountValidation) {
      this.setState({
        DAISavingsAmountValidation: true
      });
    } else if (!DAISavingsAmountValidation) {
      this.setState({
        DAISavingsAmountValidation: false
      });
    }
  }

  updateWeiAmountValidation(WEIAmountValidation) {
    if (WEIAmountValidation) {
      this.setState({
        WEIAmountValidation: true
      });
    } else if (!WEIAmountValidation) {
      this.setState({
        WEIAmountValidation: false
      });
    }
  }

  validateForm = async (DAIWithdrawAmount) => {
    const DAISavingsAmountValidation = TransactionUtilities.validateDAICompoundWithdrawAmount(
      DAIWithdrawAmount
    );
    const WEIAmountValidation = TransactionUtilities.hasSufficientWEIForNetworkFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.cTokenRedeemUnderlyingGasLimit
    );
    const isOnline = this.props.isOnline;

    if (DAISavingsAmountValidation && WEIAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataCompound({
        amount: DAIWithdrawAmount,
        gasLimit: GlobalConfig.cTokenRedeemUnderlyingGasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('compound-withdraw');
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
          <Title>dai savings</Title>
          <Value>{this.state.compoundDAIBalance} DAI</Value>
        </UntouchableCardContainer>
        <WithDrawAmountHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('withdraw-amount')}
          </FormHeader>
        </WithDrawAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.DAISavingsAmountValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(DAIWithdrawAmount) => {
                this.updateDaiSavingsAmountValidation(
                  TransactionUtilities.validateDAICompoundWithdrawAmount(
                    DAIWithdrawAmount
                  )
                );
                this.setState({ DAIWithdrawAmount });
              }}
              returnKeyType="done"
            />
            <CurrencySymbolText>DAI</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AdvancedContainer
          gasLimit={GlobalConfig.cTokenRedeemUnderlyingGasLimit}
        />
        <InsufficientWeiBalanceMessage
          weiAmountValidation={this.state.WEIAmountValidation}
        />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(
                this.state.DAISavingsAmountValidation &&
                this.state.WEIAmountValidation &&
                isOnline
              ) || this.state.loading
            }
            opacity={
              this.state.DAISavingsAmountValidation &&
              this.state.WEIAmountValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(this.state.DAIWithdrawAmount);
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
  saveOutgoingTransactionDataCompound,
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawDaiFromCompound);
