'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  Loader,
  IsOnlineMessage
} from '../components/common/';
import NetworkFeeContainerConfirmation from '../containers/NetworkFeeContainerConfirmation';
import I18n from '../i18n/I18n';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import GlobalConfig from '../config.json';

class SendEthConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  render() {
    const {
      outgoingTransactionData,
      outgoingTransactionObjects,
      navigation,
      netInfo
    } = this.props;
    const outgoingTransactionObject =
      outgoingTransactionObjects[outgoingTransactionObjects.length - 1];

    return (
      <RootContainer>
        <HeaderOne marginTop="96">{I18n.t('confirmation')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="280px"
          justifyContent="flex-start"
          marginTop="24"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginTop="16">
            To
          </FormHeader>
          <ToText>{outgoingTransactionData.send.toaddress}</ToText>
          <FormHeader marginBottom="8" marginTop="16">
            Amount
          </FormHeader>
          <AmountText>{outgoingTransactionData.send.amount} ETH</AmountText>
          <NetworkFeeContainerConfirmation
            gasLimit={GlobalConfig.ETHTxGasLimit}
          />
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Send"
            textColor="white"
            backgroundColor="#00A3E2"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="8px"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              if (netInfo) {
                this.setState({ loading: true, buttonDisabled: true });
                await TransactionUtilities.sendOutgoingTransactionToServer(
                  outgoingTransactionObject
                );
                navigation.reset(
                  [NavigationActions.navigate({ routeName: 'Send' })],
                  0
                );
                navigation.navigate('History');
                this.setState({ loading: false, buttonDisabled: false });
              }
            }}
          />
        </ButtonContainer>
        <Loader animating={this.state.loading} size="small" />
        <IsOnlineMessage netInfo={netInfo} />
      </RootContainer>
    );
  }
}

const ToText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
`;

const AmountText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
`;

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

function mapStateToProps(state) {
  return {
    netInfo: state.ReducerNetInfo.netInfo,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    outgoingTransactionObjects:
      state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects
  };
}

export default connect(mapStateToProps)(SendEthConfirmation);
