'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components/native';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../../actions/ActionModal';
import { saveOutgoingTransactionDataSend } from '../../actions/ActionOutgoingTransactionData';
import {
  UntouchableCardContainer,
  UseMaxButton,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  TxNextButton
} from '../common';
import { AdvancedContainer } from '../../containers/common/AdvancedContainer';
import TxConfirmationModal from '../../containers/common/TxConfirmationModal';
import ToAddressForm from '../../containers/common/ToAddressForm';
import I18n from '../../i18n/I18n';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from '../../utilities/BigNumberUtilities';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';
import ABIEncoder from '../../utilities/AbiUtilities';
import TxStorage from '../../lib/tx.js';
import GlobalConfig from '../../config.json';

class SendDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiBalance: RoundDownBigNumberPlacesFour(props.balance.dai)
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(2),
      daiAmount: '',
      daiAmountValidation: undefined,
      weiAmountValidation: undefined,
      currency: 'USD',
      loading: false
    };
  }

  componentDidMount() {
    this.updateWeiAmountValidation(
      TransactionUtilities.validateWeiAmountForTransactionFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.ERC20TransferGasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.validateWeiAmountForTransactionFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.ERC20TransferGasLimit
        )
      );
    }
    if (this.props.balance.dai != prevProps.balance.dai) {
      this.setState({
        daiBalance: RoundDownBigNumberPlacesFour(this.props.balance.dai)
          .div(new RoundDownBigNumberPlacesFour(10).pow(18))
          .toFixed(2)
      });
    }
  }

  async constructTransactionObject() {
    const daiAmount = this.state.daiAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiAmount
    );
    const decimals = 18 - parseInt(decimalPlaces);
    const transferEncodedABI = ABIEncoder.encodeTransfer(
      this.props.outgoingTransactionData.send.toaddress,
      daiAmount,
      decimals
    );

    const daiAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(
      this.state.daiAmount
    )
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.DAITokenContract)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.ERC20TransferGasLimit.toString(16))
      .tempSetData(transferEncodedABI)
      .addTokenOperation('dai', TxStorage.TxTokenOpTypeToName.transfer, [
        TxStorage.storage.getOwnAddress(),
        this.props.outgoingTransactionData.send.toaddress,
        daiAmountWithDecimals
      ]);

    return transactionObject;
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

  validateForm = async (toAddress, daiAmount) => {
    const toAddressValidation = this.props.toAddressValidation;
    const daiAmountValidation = TransactionUtilities.validateDaiAmount(
      daiAmount
    );
    const weiAmountValidation = TransactionUtilities.validateWeiAmountForTransactionFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.ERC20TransferGasLimit
    );
    const isOnline = this.props.isOnline;

    if (
      toAddressValidation &&
      daiAmountValidation &&
      weiAmountValidation &&
      isOnline
    ) {
      this.setState({
        loading: true
      });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataSend({
        toaddress: toAddress,
        amount: daiAmount,
        gasLimit: GlobalConfig.ERC20TransferGasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('send-dai');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { icon, token, title, balance } = this.props.info
    const isOnline = this.props.isOnline;

    const daiFullBalance = RoundDownBigNumberPlacesFour(balance.dai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toString();

    return (
        <>
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('amount')}
          </FormHeader>
          <UseMaxButton
            text={I18n.t('use-max')}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({ daiAmount: daiFullBalance });
              this.updateDaiAmountValidation(
                TransactionUtilities.validateDaiAmount(daiFullBalance)
              );
            }}
          />
        </FormHeaderContainer>
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
                  TransactionUtilities.validateDaiAmount(daiAmount)
                );
                this.setState({ daiAmount });
              }}
              returnKeyType="done"
              value={this.state.daiAmount}
            />
            <CurrencySymbolText>{token}</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AdvancedContainer gasLimit={GlobalConfig.ERC20TransferGasLimit} />
        <InsufficientWeiBalanceMessage
          weiAmountValidation={this.state.weiAmountValidation}
        />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(
                this.state.daiAmountValidation &&
                this.state.weiAmountValidation &&
                this.props.toAddressValidation &&
                isOnline
              ) || this.state.loading
            }
            opacity={
              this.state.daiAmountValidation &&
              this.state.weiAmountValidation &&
              this.props.toAddressValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(
                this.props.outgoingTransactionData.send.toaddress,
                this.state.daiAmount
              );
              this.setState({
                loading: false
              });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </ButtonWrapper>
        </>
    );
  }
}

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 14;
  height: 56px;
  text-align: left;
  width: 80%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-top: 16px;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 16px;
  text-transform: uppercase;
`;

const BalanceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
`;

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 4;
`;

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

const FormHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    balance: state.ReducerBalance.balance,
    isOnline: state.ReducerNetInfo.isOnline,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    toAddressValidation: state.ReducerTxFormValidation.toAddressValidation
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
  saveOutgoingTransactionDataSend
};

export default connect(mapStateToProps, mapDispatchToProps)(SendDai);
