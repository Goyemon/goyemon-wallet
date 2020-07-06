import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import {
    saveTxConfirmationModalVisibility,
    updateTxConfirmationModalVisibleType
  } from '../../actions/ActionModal';
import { saveOutgoingTransactionDataSend } from '../../actions/ActionOutgoingTransactionData';
import TxConfirmationModal from '../../containers/common/TxConfirmationModal';
import {
    UntouchableCardContainer,
    Form,
    FormHeader,
    Loader,
    IsOnlineMessage,
    TxNextButton,
    InsufficientWeiBalanceMessage,
    UseMaxButton
  } from '../common';
import {
    RoundDownBigNumberPlacesFour,
    RoundDownBigNumberPlacesEighteen
  } from '../../utilities/BigNumberUtilities';
import { AdvancedContainer } from '../../containers/common/AdvancedContainer';
import ToAddressForm from '../../containers/common/ToAddressForm';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';
import GlobalConfig from '../../config.json';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';
import I18n from '../../i18n/I18n';
import TxStorage from '../../lib/tx.js';
import Web3 from 'web3';

class SendToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountValidation: undefined,
            balance: props.balance,
            amount: '',
            loading: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.gasChosen != prevProps.gasChosen)
          this.updateAmountValidation(
            TransactionUtilities.validateWeiAmountForTransactionFee(
              TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
              GlobalConfig.ERC20TransferGasLimit
            )
          )
        if (this.props.info.balance != prevProps.info.balance)
          this.setState({
            balance: RoundDownBigNumberPlacesFour(this.props.info.balance)
              .div(new RoundDownBigNumberPlacesFour(10).pow(18))
              .toFixed(2)
          })
    }

    isEth = () => this.props.info.token === 'ETH'

    updateAmountValidation = isValid => this.setState({ amountValidation: isValid})

    getFullAmount = () => {
        const
        tokenBalance = this.isEth()
            ? new RoundDownBigNumberPlacesEighteen(this.props.info.option.wei)
            : balance,
        networkFeeLimit = new RoundDownBigNumberPlacesEighteen(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
        ).times(GlobalConfig.ETHTxGasLimit)

        return this.isEth()
            ? tokenBalance.isLessThanOrEqualTo(networkFeeLimit)
            ? tokenBalance.minus(networkFeeLimit).toString()
            : tokenBalance.minus(networkFeeLimit).toString()
            : RoundDownBigNumberPlacesFour(tokenBalance)
            .div(new RoundDownBigNumberPlacesFour(10).pow(18))
            .toString()
    }

    validateForm = async (toAddress, amount) => {
        const
        toAddressValidation = this.props.toAddressValidation,
        amountValidation = this.isEth()
            ? TransactionUtilities.validateWeiAmount(amount, GlobalConfig.ETHTxGasLimit)
            : TransactionUtilities.validateDaiAmount(amount),
        isOnline = this.props.isOnline

        if (toAddressValidation && amountValidation && isOnline) {
            LogUtilities.logInfo('validation successful');
            this.setState({ loading: true });
            const transactionObject = await this.constructTransactionObject();
            LogUtilities.logInfo('transaction objcet', transactionObject);
            this.props.saveOutgoingTransactionDataSend({
                toaddress: toAddress,
                amount: this.isEth() ? Web3.utils.fromWei(amount.toString(16)) : amount,
                gasLimit: GlobalConfig.ETHTxGasLimit,
                transactionObject: transactionObject
            });
            this.props.saveTxConfirmationModalVisibility(true);
            this.props.updateTxConfirmationModalVisibleType('send-eth');
        }
        else
            LogUtilities.logInfo('form validation failed!');
        this.setState({ loading: false });
    }

    constructTransactionObject = async () =>
        (await TxStorage.storage.newTx())
        .setTo(this.props.outgoingTransactionData.send.toaddress)
        .setValue(new RoundDownBigNumberPlacesEighteen(this.state.amount).toString(16))
        .setGasPrice(TransactionUtilities.returnTransactionSpeed(this.props.gasChosen).toString(16))
        .setGas(GlobalConfig.ETHTxGasLimit.toString(16))

    render() {
        const { amountValidation, loading, amount } = this.state
        const { icon, token, title, balance } = this.props.info
        const fullAmount = this.getFullAmount()

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
                <CoinImage source={icon} />
                <Title>{title}</Title>
                <BalanceContainer>
                <Value>{balance} {token}</Value>
                </BalanceContainer>
                </UntouchableCardContainer>
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
                            amount: fullAmount
                        });
                        this.updateAmountValidation(this.isEth()
                            ? TransactionUtilities.validateWeiAmount(fullAmount, GlobalConfig.ETHTxGasLimit)
                            : TransactionUtilities.validateDaiAmount(fullAmount)
                        );
                    }}
                />
                </FormHeaderContainer>
                <Form
                    borderColor={StyleUtilities.getBorderColor(
                        amountValidation
                    )}
                    borderWidth={1}
                    height="56px"
                ><SendTextInputContainer>
                <SendTextInput
                  placeholder="0"
                  keyboardType="numeric"
                  clearButtonMode="while-editing"
                  onChangeText={amount => {
                    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(amount);
                    this.setState({ amount });
                    if (isNumber) {
                        this.updateAmountValidation(
                            this.isEth()
                            ? TransactionUtilities.validateWeiAmount(
                                amount,
                                GlobalConfig.ETHTxGasLimit
                              )
                            : TransactionUtilities.validateDaiAmount(amount)
                        );
                        this.setState({
                            amount: amount
                        });
                    } else {
                      this.updateAmountValidation(false);
                    }
                  }}
                  returnKeyType="done"
                  value={this.isEth()
                    ? amount
                    ? RoundDownBigNumberPlacesFour(Web3.utils.fromWei(amount)).toFixed(4)
                    : ''
                    : amount}
                />
                <CurrencySymbolText>{token}</CurrencySymbolText>
              </SendTextInputContainer>
              </Form>
              <AdvancedContainer gasLimit={GlobalConfig.ERC20TransferGasLimit} />
              <InsufficientWeiBalanceMessage weiAmountValidation={amountValidation} />
              <ButtonWrapper>
            <TxNextButton
                disabled={
                !(
                    amountValidation &&
                    this.props.toAddressValidation &&
                    this.props.isOnline
                ) || loading
                }
                opacity={
                amountValidation &&
                this.props.toAddressValidation &&
                this.props.isOnline
                    ? 1
                    : 0.5
                }
                onPress={async () =>
                    await this.validateForm(this.props.outgoingTransactionData.send.toaddress, amount)
                }
            />
            <Loader animating={loading} size="small" />
            </ButtonWrapper>
                <IsOnlineMessage isOnline={this.props.isOnline} />
            </View>
        )
    }
}

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

mapStateToProps = state => {
    return {
      isOnline: state.ReducerNetInfo.isOnline,
      gasChosen: state.ReducerGasPrice.gasChosen,
      outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
      toAddressValidation: state.ReducerTxFormValidation.toAddressValidation,
    };
}


const mapDispatchToProps = {
    saveTxConfirmationModalVisibility,
    updateTxConfirmationModalVisibleType,
    saveOutgoingTransactionDataSend
};

export default connect(mapStateToProps, mapDispatchToProps)(SendToken);
