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
  CrypterestText,
  Loader,
  IsOnlineMessage
} from '../components/common/';
import NetworkFeeContainerConfirmation from '../containers/NetworkFeeContainerConfirmation';
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

  async sendSignedTx() {
    const outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];
    await TransactionUtilities.sendOutgoingTransactionToServer(
      outgoingTransactionObject
    );
  }

  render() {
    const { outgoingTransactionData } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/ether_icon.png')} />
          <CrypterestText fontSize="16">You are about to send</CrypterestText>
          <TotalValue>{outgoingTransactionData.send.amount} ETH</TotalValue>
          <CrypterestText fontSize="16">+ network fee</CrypterestText>
        </TotalContainer>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="280px"
          justifyContent="flex-start"
          marginTop="0"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            To
          </FormHeader>
          <ToText>{outgoingTransactionData.send.toaddress}</ToText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
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
              if (this.props.netInfo) {
                this.setState({ loading: true, buttonDisabled: true });
                await this.sendSignedTx();
                this.props.navigation.reset(
                  [NavigationActions.navigate({ routeName: 'WalletList' })],
                  0
                );
                this.props.navigation.navigate('History');
                this.setState({ loading: false, buttonDisabled: false });
              }
            }}
          />
        </ButtonContainer>
        <Loader animating={this.state.loading} size="small" />
        <IsOnlineMessage netInfo={this.props.netInfo} />
      </RootContainer>
    );
  }
}

const TotalContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 56;
  margin-top: 56;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const ToText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const AmountText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const TotalValue = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
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
