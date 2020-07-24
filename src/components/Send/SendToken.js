import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../../actions/ActionModal';
import { saveOutgoingTransactionDataSend } from '../../actions/ActionOutgoingTransactionData';
import TxConfirmationModal from '../TxConfirmationModal';
import {
  UntouchableCardContainer,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  NetworkFeeValidateMessage,
  TxNextButton,
  AmountValidateMessage,
  UseMaxButton
} from '../common';
import {
  RoundDownBigNumberPlacesEighteen,
  roundDownFour
} from '../../utilities/BigNumberUtilities';
import { AdvancedContainer } from '../AdvancedContainer';
import ToAddressForm from './ToAddressForm';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';
import GlobalConfig from '../../config.json';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';
import I18n from '../../i18n/I18n';
import Web3 from 'web3';

class SendToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountValidation: undefined,
      networkFeeValidation: undefined,
      balance: props.info.balance,
      amount: 0,
      displayAmount: 0,
      loading: false,
      isEth: props.info.token === 'ETH',
      gasLimit: this.gasLimit(props.info.token)
    };
  }

  componentDidMount() {
    this.updateNetworkFeeValidation(
      TransactionUtilities.hasSufficientWEIForNetworkFee(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
        this.state.gasLimit
      )
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateNetworkFeeValidation(
        TransactionUtilities.hasSufficientWEIForNetworkFee(
          TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
          this.state.gasLimit
        )
      );
      if (this.state.isEth)
        this.updateAmountValidation(
          TransactionUtilities.hasSufficientWeiForAmount(
            this.state.amount,
            GlobalConfig.ETHTxGasLimit
          )
        );
    }
    if (this.props.info.balance != prevProps.info.balance)
      this.setState({
        balance: roundDownFour(this.props.info.balance).toFixed(2)
      });
    if (this.props.info.token != prevProps.info.token) {
      this.setState({
        amountValidation: undefined,
        amount: 0,
        displayAmount: 0,
        isEth: this.props.info.token === 'ETH',
        gasLimit: this.gasLimit(this.props.info.token)
      });
    }
  }

  isNumber = (amount) =>
    String(amount).slice(0, 1) === '0'
      ? String(amount).slice(1, 2) === '.' && /^[0-9]\d*(\.\d+)?$/.test(amount)
      : /^[0-9]\d*(\.\d+)?$/.test(amount);

  isDisabled = () =>
    !this.state.amountValidation ||
    !this.state.networkFeeValidation ||
    !this.props.toAddressValidation ||
    !this.props.isOnline ||
    this.state.loading;

  updateAmountValidation = (isValid) =>
    this.setState({ amountValidation: isValid });

  updateNetworkFeeValidation = (isValid) =>
    this.setState({ networkFeeValidation: isValid });

  gasLimit = (token) => {
    const gasLimit = {
      ETH: GlobalConfig.ETHTxGasLimit,
      DAI: GlobalConfig.DAITransferGasLimit,
      cDAI: GlobalConfig.cDAITransferGasLimit,
      plDAI: GlobalConfig.plDAITransferGasLimit
    };
    return gasLimit[token] || null;
  };

  getFullAmount = () => {
    const tokenBalance = this.state.isEth
        ? new RoundDownBigNumberPlacesEighteen(this.props.balance.wei)
        : new RoundDownBigNumberPlacesEighteen(this.props.info.balance),
      maxNetworkFee = new RoundDownBigNumberPlacesEighteen(
        TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
      ).times(this.state.gasLimit);

    return this.state.isEth
      ? tokenBalance.isLessThanOrEqualTo(maxNetworkFee)
        ? tokenBalance.minus(maxNetworkFee).toString()
        : tokenBalance.minus(maxNetworkFee).toString()
      : tokenBalance.toString();
  };

  validateForm = async (toAddress, amount) => {
    const { toAddressValidation, isOnline } = this.props;
    const amountValidation = this.state.isEth
      ? TransactionUtilities.hasSufficientWeiForAmount(
          amount,
          this.state.gasLimit
        )
      : TransactionUtilities.hasSufficientTokenForAmount(
          amount,
          this.props.info.token
        );

    if (
      toAddressValidation &&
      amountValidation &&
      this.state.networkFeeValidation &&
      isOnline
    ) {
      this.setState({ loading: true });
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataSend({
        toaddress: toAddress,
        amount: this.state.isEth
          ? Web3.utils.fromWei(amount.toString(16))
          : amount,
        gasLimit: this.state.gasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType(
        `send-${this.props.info.token.toLowerCase()}`
      );
      LogUtilities.logInfo('validation successful');
    } else LogUtilities.logInfo('form validation failed!');
    this.setState({ loading: false });
  };

  constructTransactionObject = async () => {
    switch (this.props.info.token) {
      case 'ETH':
        return await TransactionUtilities.constructETHTransfer(
          this.props.outgoingTransactionData.send.toaddress,
          this.state.amount,
          this.props.gasChosen,
          this.state.gasLimit
        );

      case 'DAI':
        return await TransactionUtilities.constructDAITransfer(
          this.props.outgoingTransactionData.send.toaddress,
          this.state.amount,
          this.props.gasChosen,
          this.state.gasLimit
        );

      case 'cDAI':
        return await TransactionUtilities.constructCDAITransfer(
          this.props.outgoingTransactionData.send.toaddress,
          this.state.amount,
          this.props.gasChosen,
          this.state.gasLimit
        );

      case 'plDAI':
        return await TransactionUtilities.constructPLDAITransfer(
          this.props.outgoingTransactionData.send.toaddress,
          this.state.amount,
          this.props.gasChosen,
          this.state.gasLimit
        );

      default:
        return null;
    }
  };

  render() {
    const {
      amountValidation,
      networkFeeValidation,
      loading,
      amount,
      displayAmount,
      isEth,
      gasLimit
    } = this.state;
    const { token } = this.props.info;
    const fullAmount = this.getFullAmount();

    return (
      <View>
        <TxConfirmationModal />
        <SendTokenHeader data={this.props.info} />
        <ToAddressForm />
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('amount')}
          </FormHeader>
          <UseMaxButton
            text={I18n.t('use-max')}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({
                amount: fullAmount,
                displayAmount: isEth
                  ? Web3.utils.fromWei(fullAmount)
                  : fullAmount
              });
              this.updateAmountValidation(
                isEth
                  ? TransactionUtilities.hasSufficientWeiForAmount(
                      fullAmount,
                      GlobalConfig.ETHTxGasLimit
                    )
                  : TransactionUtilities.hasSufficientTokenForAmount(
                      fullAmount,
                      token
                    )
              );
            }}
          />
        </FormHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            amountValidation && this.isNumber(displayAmount)
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(amount) => {
                this.setState({ displayAmount: amount });
                if (
                  this.isNumber(amount) &&
                  TransactionUtilities.isLessThan18Digits(amount)
                ) {
                  this.updateAmountValidation(
                    isEth
                      ? TransactionUtilities.hasSufficientWeiForAmount(
                          Web3.utils.toWei(amount),
                          GlobalConfig.ETHTxGasLimit
                        )
                      : TransactionUtilities.hasSufficientTokenForAmount(
                          amount,
                          token
                        )
                  );
                  this.setState({
                    amount: isEth ? Web3.utils.toWei(amount) : amount
                  });
                } else {
                  this.updateAmountValidation(false);
                }
              }}
              returnKeyType="done"
              value={String(displayAmount)}
            />
            <CurrencySymbolText>{token}</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AmountValidateMessage
          amountValidation={amountValidation}
          isEth={isEth}
        />
        <AdvancedContainer gasLimit={gasLimit} />
        <NetworkFeeValidateMessage
          networkFeeValidation={networkFeeValidation}
        />
        <ButtonWrapper>
          <TxNextButton
            disabled={this.isDisabled()}
            opacity={!this.isDisabled() ? 1 : 0.5}
            onPress={async () =>
              await this.validateForm(
                this.props.outgoingTransactionData.send.toaddress,
                amount
              )
            }
          />
          <Loader animating={loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage isOnline={this.props.isOnline} />
      </View>
    );
  }
}

const FormHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

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

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

const SendTokenHeader = (props) => (
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
    <CoinImage source={props.data.icon} />
    <Title>{props.data.title}</Title>
    <BalanceContainer>
      <Value>
        {props.data.balance} {props.data.token}
      </Value>
    </BalanceContainer>
  </UntouchableCardContainer>
);

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

mapStateToProps = (state) => {
  return {
    isOnline: state.ReducerNetInfo.isOnline,
    gasChosen: state.ReducerGasPrice.gasChosen,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    balance: state.ReducerBalance.balance,
    toAddressValidation: state.ReducerTxFormValidation.toAddressValidation
  };
};

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
  saveOutgoingTransactionDataSend
};

export default connect(mapStateToProps, mapDispatchToProps)(SendToken);
