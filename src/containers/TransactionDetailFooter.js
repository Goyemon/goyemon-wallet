'use strict';
import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import LogUtilities from '../utilities/LogUtilities';
import { HeaderFive } from '../components/common';
import Copy from './common/Copy';
import GlobalConfig from '../config.json';

export default class TransactionDetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txData: props.txData,
            isNeedTo: this.getTo(props.txData),
            isNeedFrom: this.getFrom(props.txData),
            destination: this.getDest(props.txData, props.tx)
        }
    }

    getTo = txData => txData.length === 1 && txData[0].direction == 'outgoing' && txData[0].type == 'transfer' ? true : false

    getFrom = txData => txData.length === 1 && txData[0].direction == 'incoming' && txData[0].type == 'transfer' ? true : false

    getDest = (txData, tx) => txData[0].token === 'eth'
    ? tx.getTo().substring(0, 24) + '...'
    : '0x' + tx.tokenData.dai[0].to_addr.substring(0, 24) + '...'

    componentDidMount() {
        LogUtilities.toDebugScreen('Transaction Detail Header CDM', this.props.service);
    }

    render() {
        const { service } = this.props
        const { isNeedTo, isNeedFrom, destination } = this.state
        return (
            <TxNetworkAndHash>
              {service !== '' &&
                <>
                    <HeaderFive fontSize={20}>Application</HeaderFive>
                    <TxDetailValue>
                    {service}
                    </TxDetailValue>
                </>
              }

              {this.state.txData[0].direction &&
              <>
                {isNeedFrom &&
                <>
                  <HeaderFive fontSize={20}>From</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {this.props.tx.getFrom().substring(0, 24) + '...'}
                    </ToAndFromValue>
                    <Copy text={this.props.tx.getFrom()} icon={false} />
                  </ToAndFromValueContainer>
                </>}

                {isNeedTo &&
                <>
                  <HeaderFive fontSize={20}>To</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {destination}
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
