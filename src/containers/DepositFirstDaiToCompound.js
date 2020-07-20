'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveOutgoingTransactionDataCompound } from '../actions/ActionOutgoingTransactionData';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
} from '../actions/ActionModal';
import {
  RootContainer,
  UseMaxButton,
  UntouchableCardContainer,
  HeaderOne,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  TxNextButton,
} from '../components/common';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import { AdvancedContainer } from './common/AdvancedContainer';
import I18n from '../i18n/I18n';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen,
} from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class DepositFirstDaiToCompound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiBalance: RoundDownBigNumberPlacesFour(props.balance.dai)
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(2),
      daiAmount: '',
      daiAmountValidation: undefined,
      weiAmountValidation: undefined,
      loading: false,
    };
  }

  componentDidMount() {
    this.updateWeiAmountValidation(
      TransactionUtilities.hasSufficientWeiForNetworkFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit,
      ),
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.hasSufficientWeiForNetworkFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit,
        ),
      );
    }
    if (this.props.balance.dai != prevProps.balance.dai) {
      this.setState({
        daiBalance: RoundDownBigNumberPlacesFour(this.props.balance.dai)
          .div(new RoundDownBigNumberPlacesFour(10).pow(18))
          .toFixed(2),
      });
    }
  }

  async constructMintTransactionObject() {
    const daiAmount = this.state.daiAmount.split('.').join('');
    const decimalPlaces = TransactionUtilities.decimalPlaces(
      this.state.daiAmount,
    );
    const decimals = 18 - parseInt(decimalPlaces);

    const mintEncodedABI = ABIEncoder.encodeCDAIMint(daiAmount, decimals);

    const daiAmountWithDecimals = new RoundDownBigNumberPlacesEighteen(
      this.state.daiAmount,
    )
      .times(new RoundDownBigNumberPlacesEighteen(10).pow(18))
      .toString(16);

    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(GlobalConfig.cDAIcontract)
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen,
        ).toString(16),
      )
      .setGas(GlobalConfig.cTokenMintGasLimit.toString(16))
      .tempSetData(mintEncodedABI)
      .addTokenOperation('cdai', TxStorage.TxTokenOpTypeToName.mint, [
        TxStorage.storage.getOwnAddress(),
        daiAmountWithDecimals,
        0,
      ]);

    return transactionObject.setNonce(transactionObject.getNonce() + 1);
  }

  updateDaiAmountValidation(daiAmountValidation) {
    if (daiAmountValidation) {
      this.setState({
        daiAmountValidation: true,
      });
    } else if (!daiAmountValidation) {
      this.setState({
        daiAmountValidation: false,
      });
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if (weiAmountValidation) {
      this.setState({
        weiAmountValidation: true,
      });
    } else if (!weiAmountValidation) {
      this.setState({
        weiAmountValidation: false,
      });
    }
  }

  validateForm = async (daiAmount) => {
    const daiAmountValidation = TransactionUtilities.hasSufficientDaiForAmount(
      daiAmount,
    );
    const weiAmountValidation = TransactionUtilities.hasSufficientWeiForNetworkFee(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
      GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit,
    );
    const isOnline = this.props.isOnline;

    if (daiAmountValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const approveTransactionObject = await TransactionUtilities.constructApproveTransactionObject(
        GlobalConfig.cDAIcontract,
        this.props.gasChosen,
      );
      const mintTransactionObject = await this.constructMintTransactionObject();
      this.props.saveOutgoingTransactionDataCompound({
        amount: daiAmount,
        gasLimit:
          GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit,
        approveTransactionObject: approveTransactionObject,
        transactionObject: mintTransactionObject,
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('compound-approve');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const { balance, compound } = this.props;
    const isOnline = this.props.isOnline;

    const currentInterestRate = new BigNumber(compound.dai.currentInterestRate)
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const daiFullBalance = RoundDownBigNumberPlacesFour(balance.dai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toString();

    return (
      <RootContainer>
        <TxConfirmationModal />
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
          <Value>{this.state.daiBalance} DAI</Value>
          <Title>interest rate</Title>
          <Value>{currentInterestRate} %</Value>
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
                TransactionUtilities.hasSufficientDaiForAmount(daiFullBalance),
              );
            }}
          />
        </DepositAmountHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.daiAmountValidation,
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
                  TransactionUtilities.hasSufficientDaiForAmount(daiAmount),
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
            GlobalConfig.ERC20ApproveGasLimit + GlobalConfig.cTokenMintGasLimit
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
    compound: state.ReducerCompound.compound,
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    balance: state.ReducerBalance.balance,
    isOnline: state.ReducerNetInfo.isOnline,
  };
}

const mapDispatchToProps = {
  saveOutgoingTransactionDataCompound,
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepositFirstDaiToCompound);
