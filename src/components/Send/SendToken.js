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
    UseMaxButton
  } from '../common';
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
            balance: props.balance
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
                <IsOnlineMessage isOnline={this.props.isOnline} />
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
                ></Form>
                {this.returnTokenComp()}
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

mapStateToProps = state => {
    return {
      isOnline: state.ReducerNetInfo.isOnline,
      gasChosen: state.ReducerGasPrice.gasChosen,
    };
}

export default connect(mapStateToProps)(SendToken);
