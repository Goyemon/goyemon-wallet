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
    IsOnlineMessage
  } from '../common';
import ToAddressForm from '../../containers/common/ToAddressForm';

class SendToken extends Component {
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

function mapStateToProps(state) {
    return {
      isOnline: state.ReducerNetInfo.isOnline
    };
}

export default connect(mapStateToProps)(SendToken);
