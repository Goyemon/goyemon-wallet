'use strict';
import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    HeaderFive,
    GoyemonText,
    TransactionStatus,
    HorizontalLine,
  } from '../components/common';
import LogUtilities from '../utilities/LogUtilities';
import GlobalConfig from '../config.json';
import SwapBox from '../components/TransactionDetailContainer/SwapBox'
import TransactionDetailHeader from '../components/TransactionDetailContainer/TransactionDetailHeader'
import PTWithdrawBox from '../components/TransactionDetailContainer/PTWithdrawBox'

export default class TransactionDetailContainer extends Component {
    componentDidMount() {
      LogUtilities.toDebugScreen('TDC componentDidMount', this.props.data)
    }

    render() {
        const { timestamp, status, service, amount, token, networkFee, hash, to, from, icon, option } = this.props.data
        let { method } = this.props.data
        const { name, size, color } = this.props.data.inOrOut
        if (service === 'PoolTogether' || service === 'Uniswap') {
          if (!option && method === 'Withdraw')
            method = 'Outgoing'
          if (!option && method === 'Swap')
            method = 'Outgoing'
        }

        return (
            <>
            <TransactionDetailHeader
              icon={icon}
              timestamp={timestamp}
              status={status}
              method={method}
            />
            {service === 'PoolTogether' && method === 'Withdraw'
            ? <PTWithdrawBox name={name} size={size} color={color} option={option} token={token}/>
            : method === 'Swap'
            ? <SwapBox option={option}/>
            : <>
                  {amount && <SubtotalBox>
                    <Icon name={name} size={size + 10} color={color} />
                    <GoyemonText fontSize={24}>
                      {amount}
                      {token}
                    </GoyemonText>
                  </SubtotalBox>}
              </>}
            <HorizontalLine borderColor="rgba(95, 95, 95, .2)"/>
            <TxNetworkAndHash>
              {service !== '' &&
              <>
                <HeaderFive fontSize={20}>Application</HeaderFive>
                <TxDetailValue>{service}</TxDetailValue>
              </>}
              {from
              ? <>
                  <HeaderFive fontSize={20}>From</HeaderFive>
                  <TxDetailValue>
                    {from.substring(0, 24) + '...'}
                  </TxDetailValue>
                </>
              : to
              ? <>
                  <HeaderFive fontSize={20}>To</HeaderFive>
                  <TxDetailValue>
                    {to.substring(0, 24) + '...'}
                  </TxDetailValue>
                </>
              : null}
              <HeaderFive fontSize={20}>Network Fee</HeaderFive>
              <TxDetailValue>
                {networkFee} ETH
              </TxDetailValue>
              {status >= 1 &&
                <View>
                  <HeaderFive fontSize={20}>Hash</HeaderFive>
                  <TxDetailValue
                      onPress={() => {
                        Linking.openURL(
                          `${GlobalConfig.EtherscanLink}${'0x' + hash}`
                        ).catch((err) => LogUtilities.logError('An error occurred', err));
                      }}
                    >
                      {'0x' + hash.substring(0, 24) + '...'}
                      <Icon name="link-variant" size={16} color="#5f5f5f" />
                  </TxDetailValue>
                </View>}
            </TxNetworkAndHash>
          </>)
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

const SubtotalBox = styled.View`
font-family: 'HKGrotesk-Regular';
flex-direction: row;
margin-left: 4%;
margin-top: 32;
margin-bottom: 32;
align-items: center;
width: 90%;
`;
