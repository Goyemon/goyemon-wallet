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
            ? <>
                <SubtotalWithdrawBox>
                  <Icon name={name} size={size + 10} color={color} />
                  <GoyemonText fontSize={24}>
                  {option.sum}
                  {token}
                  </GoyemonText>
                  <LabelsBox>
                    <GoyemonText fontSize={14}>Open</GoyemonText>
                    <GoyemonText fontSize={14}>Committed</GoyemonText>
                    <GoyemonText fontSize={14}>Sponsor</GoyemonText>
                  </LabelsBox>
                  <ValueBox>
                    <GoyemonText fontSize={14}>{option.open}DAI</GoyemonText>
                    <GoyemonText fontSize={14}>{option.committed}DAI</GoyemonText>
                    <GoyemonText fontSize={14}>{option.sponsor}DAI</GoyemonText>
                  </ValueBox>
                </SubtotalWithdrawBox>
              </>
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

const HeaderStatus = styled.View`
align-items: center;
font-family: 'HKGrotesk-Regular';
width: 40%;
`;

const LabelsBox = styled.View`
flex-direction: column;
margin-left: 22%;
`;

const ValueBox = styled.View`
flex-direction: column;
margin-left: 5%;
`

const SubtotalWithdrawBox = styled.View`
flex-direction: row;
margin-left: 4%;
margin-top: 32;
margin-bottom: 32;
align-items: flex-start;
width: 90%;
`;

const SubtotalSwapBox = styled.View`
flex-direction: column;
margin-left: 4%;
margin-top: 32;
margin-bottom: 32;
align-items: flex-start;
width: 90%;
`;

const SoldBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4;
  margin-bottom: 16;
`;

const BoughtBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4;
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

class TransactionDetailHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: props.icon,
      timestamp: props.timestamp,
      status: props.status,
      method: props.method
    }
  }

  render() {
    const { timestamp, status, method } = this.props
    const { name, size, color } = this.props.icon
    return (
      <TxDetailHeader>
        <TxIcon>
          <Icon name={name} size={size + 8} color={color}/>
        </TxIcon>
        <TypeAndTime>
          <GoyemonText fontSize={18}>
            {method}
          </GoyemonText>
          <GoyemonText fontSize={15}>
            {timestamp}
          </GoyemonText>
        </TypeAndTime>
        <HeaderStatus>
          <TransactionStatus
            width="100%"
            txState={status}
          />
        </HeaderStatus>
      </TxDetailHeader>
    )
  }
}

const TxDetailHeader = styled.View`
align-items: center;
background-color: #f8f8f8;
flex-direction: row;
justify-content: center;
font-family: 'HKGrotesk-Regular';
padding-top: 24px;
padding-bottom: 24px;
width: 100%;
`;

const TxIcon = styled.View`
align-items: center;
width: 20%;
`;

const TypeAndTime = styled.View`
align-items: flex-start;
font-family: 'HKGrotesk-Regular';
flex-direction: column;
width: 40%;
`;

const SwapBox = props =>
  <SubtotalSwapBox>
    <HeaderFive>Sold</HeaderFive>
    <SoldBox>
      <Icon name="minus" size={26} color="#F1860E" /><GoyemonText fontSize={24}>{props.option.eth}ETH</GoyemonText>
    </SoldBox>
    <HeaderFive>Bought</HeaderFive>
    <BoughtBox>
      <Icon name="plus" size={26} color="#1BA548" /><GoyemonText fontSize={24}>{props.option.dai}DAI</GoyemonText>
    </BoughtBox>
  </SubtotalSwapBox>
