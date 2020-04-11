'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  IsOnlineMessage,
} from '../components/common/';
import NetworkFeeContainerConfirmation from '../containers/NetworkFeeContainerConfirmation';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import GlobalConfig from '../config.json';

class SwapConfirmation extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      buttonDisabled: false,
    };
  }

  render() {
    const { outgoingTransactionData } = this.props;
    const outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <IconContainer>
            <CoinImage source={require('../../assets/ether_icon.png')} />
            <Icon name="swap-horizontal" size={24} color="#5f5f5f" />
            <CoinImage source={require('../../assets/dai_icon.png')} />
          </IconContainer>
          <GoyemonText fontSize="16">You are about to swap</GoyemonText>
          <TotalValue>{outgoingTransactionData.swap.sold} ETH</TotalValue>
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
          <FormHeader marginBottom="8" marginTop="16">
            You Pay
          </FormHeader>
          <Amount>{outgoingTransactionData.swap.sold} ETH</Amount>
          <FormHeader marginBottom="8" marginTop="16">
            You Get at Least
          </FormHeader>
          <Amount>
            {outgoingTransactionData.swap.minBought.toFixed(4)} DAI
          </Amount>
          <Amount>*slippage {outgoingTransactionData.swap.slippage} %</Amount>
          <NetworkFeeContainerConfirmation
            gasLimit={GlobalConfig.cTokenRedeemUnderlyingGasLimit}
          />
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Swap"
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
                await TransactionUtilities.sendOutgoingTransactionToServer(
                  outgoingTransactionObject
                );
                this.props.navigation.reset(
                  [NavigationActions.navigate({ routeName: 'Swap' })],
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
  margin-bottom: 28;
  margin-top: 56;
`;

const IconContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin: 0 8px;
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
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
  };
}

export default connect(mapStateToProps)(SwapConfirmation);
