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
    ValidateMessage,
    UseMaxButton
  } from '../common';
import {
    RoundDownBigNumberPlacesEighteen,
    roundDownFour
  } from '../../utilities/BigNumberUtilities';
import { AdvancedContainer } from '../../containers/common/AdvancedContainer';
import ToAddressForm from '../../containers/common/ToAddressForm';
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
            balance: props.info.balance,
            amount: 0,
            displayAmount: 0,
            loading: false,
            isEth: props.info.token === 'ETH',
            gasLimit: this.gasLimit(props.info.token)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.gasChosen != prevProps.gasChosen)
          this.updateAmountValidation(
            TransactionUtilities.validateWeiAmountForTransactionFee(
              TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
              this.state.gasLimit
            )
          )
        if (this.props.info.balance != prevProps.info.balance)
          this.setState({
            balance: roundDownFour(this.props.info.balance).toFixed(2)
          })
        if (this.props.info.token != prevProps.info.token)
          this.setState({
            amountValidation: undefined,
            amount: 0,
            displayAmount: 0,
            isEth: this.props.info.token === 'ETH',
            gasLimit: this.gasLimit(this.props.info.token)
          })
    }

    isNumber = amount => /^[0-9]\d*(\.\d+)?$/.test(amount)

    isDisabled = () => !this.state.amountValidation || !this.props.toAddressValidation || !this.props.isOnline || this.state.loading

    updateAmountValidation = isValid => this.setState({ amountValidation: isValid})

    gasLimit = token => {
      const gasLimit = {
        'ETH': GlobalConfig.ETHTxGasLimit,
        'DAI': GlobalConfig.DAITransferGasLimit,
        'cDAI': GlobalConfig.cDAITransferGasLimit,
        'plDAI': GlobalConfig.plDAITransferGasLimit
      }
      return gasLimit[token] || null
    }

    getFullAmount = () => {
        const
        tokenBalance = this.state.isEth
            ? new RoundDownBigNumberPlacesEighteen(this.props.balance.wei)
            : this.props.info.balance,
        networkFeeLimit = new RoundDownBigNumberPlacesEighteen(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
        ).times(this.state.gasLimit)

        return this.state.isEth
            ? tokenBalance.isLessThanOrEqualTo(networkFeeLimit)
            ? tokenBalance.minus(networkFeeLimit).toString()
            : tokenBalance.minus(networkFeeLimit).toString()
            : roundDownFour(tokenBalance).toString()
    }

    isEfficientGas = () => {
        const networkFeeLimit = new RoundDownBigNumberPlacesEighteen(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
        ).times(this.state.gasLimit)
        const ethBalance = new RoundDownBigNumberPlacesEighteen(this.props.balance.wei)
        return ethBalance.isLessThanOrEqualTo(networkFeeLimit)
    }

    validateForm = async (toAddress, amount) => {
        const { toAddressValidation, isOnline } = this.props
        const amountValidation = this.state.isEth
            ? TransactionUtilities.validateWeiAmount(amount, this.state.gasLimit)
            : TransactionUtilities.validateDaiAmount(amount)

        if (toAddressValidation && amountValidation && isOnline) {
            this.setState({ loading: true });
            const transactionObject = await this.constructTransactionObject();
            this.props.saveOutgoingTransactionDataSend({
                toaddress: toAddress,
                amount: this.state.isEth ? Web3.utils.fromWei(amount.toString(16)) : amount,
                gasLimit: this.state.gasLimit,
                transactionObject: transactionObject
            });
            this.props.saveTxConfirmationModalVisibility(true);
            this.props.updateTxConfirmationModalVisibleType(`send-${this.props.info.token.toLowerCase()}`);
            LogUtilities.logInfo('validation successful');
        }
        else
            LogUtilities.logInfo('form validation failed!');
        this.setState({ loading: false });
    }

    constructTransactionObject = async () => {
      switch(this.props.info.token) {
        case 'ETH':
          return await TransactionUtilities.constructEthTransfer(
              this.props.outgoingTransactionData.send.toaddress,
              this.state.amount,
              this.props.gasChosen,
              this.state.gasLimit
          )

        case 'DAI':
          return await TransactionUtilities.constructDaiTransfer(
            this.props.outgoingTransactionData.send.toaddress,
            this.state.amount,
            this.props.gasChosen,
            this.state.gasLimit
          )

        case 'cDAI':
          return await TransactionUtilities.constructcDaiTransfer(
            this.props.outgoingTransactionData.send.toaddress,
            this.state.amount,
            this.props.gasChosen,
            this.state.gasLimit
          )

        case 'plDAI':
          return await TransactionUtilities.constructplDaiTransfer(
            this.props.outgoingTransactionData.send.toaddress,
            this.state.amount,
            this.props.gasChosen,
            this.state.gasLimit
          )

        default:
          return null
      }
    }

    render() {
        const { amountValidation, loading, amount, displayAmount, isEth } = this.state
        const { token } = this.props.info
        const fullAmount = this.getFullAmount()

        return (
            <View>
                <TxConfirmationModal />
                <SendTokenHeader data={this.props.info}/>
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
                            displayAmount: Web3.utils.fromWei(fullAmount)
                        });
                        this.updateAmountValidation(isEth
                            ? TransactionUtilities.validateWeiAmount(fullAmount, GlobalConfig.ETHTxGasLimit)
                            : TransactionUtilities.validateDaiAmount(fullAmount)
                        );
                    }}
                />
                </FormHeaderContainer>
                <Form
                    borderColor={StyleUtilities.getBorderColor(amountValidation)}
                    borderWidth={1}
                    height="56px"
                >
                    <SendTextInputContainer>
                        <SendTextInput
                        placeholder="0"
                        keyboardType="numeric"
                        clearButtonMode="while-editing"
                        onChangeText={amount => {
                            this.setState({ displayAmount: amount })
                            if (this.isNumber(amount)) {
                                this.updateAmountValidation(
                                    isEth
                                    ? TransactionUtilities.validateWeiAmount(Web3.utils.toWei(amount), GlobalConfig.ETHTxGasLimit)
                                    : TransactionUtilities.validateDaiAmount(amount)
                                );
                                this.setState({ amount: isEth ?  Web3.utils.toWei(amount) : amount });
                            }
                        }}
                        returnKeyType="done"
                        value={String(displayAmount)}
                        />
                        <CurrencySymbolText>{token}</CurrencySymbolText>
                    </SendTextInputContainer>
                </Form>
                <AdvancedContainer gasLimit={GlobalConfig.DAITransferGasLimit} />
                <ValidateMessage
                    amountValidation={amountValidation && !this.isEfficientGas()}
                    numberValidation={this.isNumber(displayAmount)}
                    isEth={isEth}
                />
                <ButtonWrapper>
                <TxNextButton
                    disabled={this.isDisabled()}
                    opacity={!this.isDisabled() ? 1 : 0.5}
                    onPress={async () => await this.validateForm(this.props.outgoingTransactionData.send.toaddress, amount)}
                />
                <Loader animating={loading} size="small" />
                </ButtonWrapper>
                <IsOnlineMessage isOnline={this.props.isOnline} />
            </View>
        )
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

const SendTokenHeader = props =>
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
        <Value>{props.data.balance} {props.data.token}</Value>
        </BalanceContainer>
    </UntouchableCardContainer>

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

mapStateToProps = state => {
    return {
      isOnline: state.ReducerNetInfo.isOnline,
      gasChosen: state.ReducerGasPrice.gasChosen,
      outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
      balance: state.ReducerBalance.balance,
      toAddressValidation: state.ReducerTxFormValidation.toAddressValidation,
    };
}

const mapDispatchToProps = {
    saveTxConfirmationModalVisibility,
    updateTxConfirmationModalVisibleType,
    saveOutgoingTransactionDataSend
};

export default connect(mapStateToProps, mapDispatchToProps)(SendToken);
