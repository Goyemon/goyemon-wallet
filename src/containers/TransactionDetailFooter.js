'use strict';
import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StyleUtilities from '../utilities/StyleUtilities.js';
import styled from 'styled-components';
import TransactionUtilities from '../utilities/TransactionUtilities';
import LogUtilities from '../utilities/LogUtilities';
import {
    HeaderFive,
  } from '../components/common';
import Copy from './common/Copy';

export default class TransactionDetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txData: props.txData
        }
    }

    componentDidMount() {
        LogUtilities.toDebugScreen('Transaction Detail Header CDM', this.props.service);
    }

    render() {
        const { service } = this.props
        return (
            <TxNetworkAndHash>
              {service !== '' &&
                <>
                    <HeaderFive fontSize={20}>Application</HeaderFive>
                    <TxDetailValue>
                    {this.props.tx.getTo() === null ? null : this.props.tx.getApplication(this.props.tx.getTo())}
                    </TxDetailValue>
                </>
              }

              {this.state.txData[0].direction &&
              <>
                {this.state.txData.length === 1 && this.state.txData[0].direction == 'incoming' && this.state.txData[0].type == 'transfer' &&
                <>
                  <HeaderFive fontSize={20}>From</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {this.props.tx.getFrom().substring(0, 24) + '...'}
                    </ToAndFromValue>
                    <Copy text={this.props.tx.getFrom()} icon={false} />
                  </ToAndFromValueContainer>
                </>}

                {this.state.txData.length === 1 && this.state.txData[0].direction == 'outgoing' && this.state.txData[0].type == 'transfer' &&
                <>
                  <HeaderFive fontSize={20}>To</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {this.state.txData[0].token === 'eth'
                      ? this.props.tx.getTo().substring(0, 24) + '...'
                      : '0x' + this.state.tx.tokenData.dai[0].to_addr.substring(0, 24) + '...'}
                    </ToAndFromValue>
                    <Copy text={this.props.tx.getTo()} icon={false} />
                  </ToAndFromValueContainer>
                </>}

              </>}

              <HeaderFive fontSize={20}>Max Network Fee</HeaderFive>
              <TxDetailValue>
                {parseInt(this.props.tx.getGasPrice(), 16) * parseInt(this.props.tx.gas, 16) / 1000000000000000000} ETH
              </TxDetailValue>

              {(() => {
              return (
                this.props.tx.getState() < 1 ? null :
                <View>
                <HeaderFive fontSize={20}>Hash</HeaderFive>
                <TxDetailValue
                    onPress={() => {
                      Linking.openURL(
                        `${GlobalConfig.EtherscanLink}${'0x' + this.props.tx.getHash()}`
                      ).catch((err) => LogUtilities.logError('An error occurred', err));
                    }}
                  >
                    {'0x' + this.props.tx.getHash().substring(0, 24) + '...'}
                    <Icon name="link-variant" size={16} color="#5f5f5f" />
                </TxDetailValue>
                </View>
              )})()}
            </TxNetworkAndHash>
        )
    }
}

const TxNetworkAndHash = styled.View`
align-items: flex-start;
font-family: 'HKGrotesk-Regular';
justify-content: flex-start;
flex-direction: column;
margin: 24px auto;
width: 90%;
`;

const TxDetailValue = styled.Text`
color: #000;
font-family: 'HKGrotesk-Bold';
font-size: 18;
margin-top: 4;
margin-bottom: 16;
`;

const ToAndFromValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 4;
  margin-bottom: 16;
  `;

const ToAndFromValue = styled.Text`
color: #000;
font-family: 'HKGrotesk-Bold';
font-size: 18;
margin-right: 16;
`;
