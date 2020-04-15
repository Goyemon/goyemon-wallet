'use strict';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  GoyemonText,
  Loader,
  IsOnlineMessage
} from '../components/common';
import NetworkFeeContainerConfirmation from './NetworkFeeContainerConfirmation';
import I18n from '../i18n/I18n';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import GlobalConfig from '../config.json';

class DepositDaiToCompoundConfirmation extends Component {
  constructor(props) {
    super();
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
        <TotalContainer>
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <GoyemonText fontSize="16">You are about to deposit</GoyemonText>
          <TotalValue>{outgoingTransactionData.compound.amount} DAI</TotalValue>
        </TotalContainer>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="200px"
          justifyContent="flex-start"
          marginTop="0"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginTop="16">
            {I18n.t('deposit-amount')}
          </FormHeader>
          <Amount>{outgoingTransactionData.compound.amount} DAI</Amount>
          <NetworkFeeContainerConfirmation
            gasLimit={GlobalConfig.cTokenMintGasLimit}
          />
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text={I18n.t('deposit')}
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
                  [NavigationActions.navigate({ routeName: 'EarnHome' })],
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

const TotalContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 28;
  margin-top: 56;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const Amount = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
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
    outgoingTransactionObjects:
      state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData
  };
}

export default connect(mapStateToProps)(DepositDaiToCompoundConfirmation);
