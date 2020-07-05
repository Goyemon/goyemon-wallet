import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import SendEth from './SendEth';
import SendDai from './SendDai';
import SendcDai from './SendcDai';
import SendplDai from './SendplDai';
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
import { AdvancedContainer } from '../../containers/common/AdvancedContainer';
import ToAddressForm from '../../containers/common/ToAddressForm';
import TransactionUtilities from '../../utilities/TransactionUtilities.ts';
import GlobalConfig from '../../config.json';
import LogUtilities from '../../utilities/LogUtilities.js';
import StyleUtilities from '../../utilities/StyleUtilities.js';
import I18n from '../../i18n/I18n';

class SendToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountValidation: undefined,
            balance: props.balance,
            loading: false
        }
    }

    componentDidMount = () =>
        TransactionUtilities.validateWeiAmountForTransactionFee(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
            GlobalConfig.ERC20TransferGasLimit
        )

    componentDidUpdate(prevProps) {
        if (this.props.gasChosen != prevProps.gasChosen) {
          this.updateAmountValidation(
            TransactionUtilities.validateWeiAmountForTransactionFee(
              TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
              GlobalConfig.ERC20TransferGasLimit
            )
          );
        }
        if (this.props.balance != prevProps.balance) {
          this.setState({
            balance: RoundDownBigNumberPlacesFour(this.props.balance)
              .div(new RoundDownBigNumberPlacesFour(10).pow(18))
              .toFixed(2)
          });
        }
        LogUtilities.toDebugScreen('Send Token State', this.state)
    }

    updateAmountValidation = isValid => this.setState({ amountValidation: isValid})

    returnTokenComp() {
        switch(this.props.token) {
            case 'ETH':
                return <SendEth />
            case 'DAI':
                return <SendDai />
            case 'cDAI':
                return <SendcDai />
            case 'plDAI':
                return <SendplDai />
        }
    }

    render() {
        const { icon, token, title, balance } = this.props.info
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
                        this.setState({ balance: balance });
                        this.updateAmountValidation(
                            token === 'ETH'
                            ? TransactionUtilities.validateWeiAmount(
                                balance,
                                GlobalConfig.ETHTxGasLimit
                            )
                            : TransactionUtilities.validateDaiAmount(balance)
                        );
                    }}
                />
                </FormHeaderContainer>
                <Form
                    borderColor={StyleUtilities.getBorderColor(
                        this.state.amountValidation
                    )}
                    borderWidth={1}
                    height="56px"
                ><SendTextInputContainer>
                <SendTextInput
                  placeholder="0"
                  keyboardType="numeric"
                  clearButtonMode="while-editing"
                  onChangeText={balance => {
                    const isNumber = /^[0-9]\d*(\.\d+)?$/.test(balance);
                    this.setState({ balance });
                    if (isNumber) {
                        this.updateAmountValidation(
                            token === 'ETH'
                            ? TransactionUtilities.validateWeiAmount(
                                balance,
                                GlobalConfig.ETHTxGasLimit
                              )
                            : TransactionUtilities.validateDaiAmount(balance)
                        );
                        this.setState({
                            balance: token === 'ETH' ? Web3.utils.toWei(balance) : balance
                        });
                    } else {
                      this.updateAmountValidation(false);
                    }
                  }}
                  returnKeyType="done"
                  value={this.state.balance}
                />
                <CurrencySymbolText>{token}</CurrencySymbolText>
              </SendTextInputContainer>
              </Form>
              <AdvancedContainer gasLimit={GlobalConfig.ERC20TransferGasLimit} />
              <InsufficientWeiBalanceMessage
                weiAmountValidation={this.state.amountValidation}
              />
              <ButtonWrapper>
            <TxNextButton
                disabled={
                !(
                    this.state.amountValidation &&
                    this.props.toAddressValidation &&
                    this.props.isOnline
                ) || this.state.loading
                }
                opacity={
                this.state.amountValidation &&
                this.props.toAddressValidation &&
                this.props.isOnline
                    ? 1
                    : 0.5
                }
                onPress={async () => {
                await this.validateForm(
                    this.props.outgoingTransactionData.send.toaddress,
                    this.state.balance
                );
                this.setState({ loading: false });
                }}
            />
            <Loader animating={this.state.loading} size="small" />
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

export default connect(mapStateToProps)(SendToken);
