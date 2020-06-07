'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../actions/ActionModal';
import { saveOutgoingTransactionDataSend } from '../actions/ActionOutgoingTransactionData';
import { clearQRCodeData } from '../actions/ActionQRCodeData';
import {
  UntouchableCardContainer,
  UseMaxButton,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  InsufficientWeiBalanceMessage,
  TxNextButton
} from '../components/common';
import { AdvancedContainer } from '../containers/common/AdvancedContainer';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import I18n from '../i18n/I18n';
import SendStack from '../navigators/SendStack';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import ABIEncoder from '../utilities/AbiUtilities';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class SendDai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiBalance: RoundDownBigNumberPlacesFour(props.balance.dai)
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(2),
      toAddress: '',
      daiAmount: '',
      toAddressValidation: undefined,
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
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
    }
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
      this.state.toAddress,
      daiAmount,
      decimals
    );

    const daiAmountWithDecimals = new BigNumber(this.state.daiAmount)
      .times(new BigNumber(10).pow(18))
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
        this.state.toAddress,
        daiAmountWithDecimals
      ]);

    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('address validated!');
      this.setState({ toAddressValidation: true });
      return true;
    } else if (!Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('invalid address');
      this.setState({
        toAddressValidation: false
      });
      return false;
    }
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
    const toAddressValidation = this.validateToAddress(toAddress);
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
    const { balance } = this.props;
    const isOnline = this.props.isOnline;

    const daiFullBalance = RoundDownBigNumberPlacesFour(balance.dai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toString();

    return (
      <View>
        <TxConfirmationModal />
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="160px"
          justifyContent="center"
          marginTop="40"
          textAlign="center"
          width="90%"
        >
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <Title>{I18n.t('dai-wallet-balance')}</Title>
          <BalanceContainer>
            <Value>{this.state.daiBalance} DAI</Value>
          </BalanceContainer>
        </UntouchableCardContainer>
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('to')}
          </FormHeader>
        </FormHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.toAddressValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder={I18n.t('send-address')}
              clearButtonMode="while-editing"
              onChangeText={(toAddress) => {
                this.validateToAddress(toAddress);
                this.setState({ toAddress });
              }}
              value={this.state.toAddress}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.clearQRCodeData();
                SendStack.navigationOptions = () => {
                  const tabBarVisible = false;
                  return {
                    tabBarVisible
                  };
                };
                this.props.navigation.navigate('QRCodeScan');
              }}
            >
              <Icon name="qrcode-scan" size={20} color="#5f5f5f" />
            </TouchableOpacity>
          </SendTextInputContainer>
        </Form>
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
            <CurrencySymbolText>DAI</CurrencySymbolText>
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
                this.state.toAddressValidation &&
                isOnline
              ) || this.state.loading
                ? true
                : false
            }
            opacity={
              this.state.daiAmountValidation &&
              this.state.weiAmountValidation &&
              this.state.toAddressValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(
                this.state.toAddress,
                this.state.daiAmount
              );
              this.setState({
                loading: false
              });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage isOnline={this.props.isOnline} />
      </View>
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
  font-size: 14;
  height: 56px;
  width: 95%;
  text-align: left;
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
    qrCodeData: state.ReducerQRCodeData.qrCodeData
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
  saveOutgoingTransactionDataSend,
  clearQRCodeData
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(SendDai)
);
