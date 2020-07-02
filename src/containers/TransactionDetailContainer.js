'use strict';
import React, { Component } from 'react';
import StyleUtilities from '../utilities/StyleUtilities.js';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    HeaderFive,
    GoyemonText,
    TransactionStatus,
    HorizontalLine,
  } from '../components/common';
import TransactionUtilities from '../utilities/TransactionUtilities';
import LogUtilities from '../utilities/LogUtilities';

export default class TransactionDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txData: props.txData,
            timestamp: TransactionUtilities.parseTransactionTime(props.timestamp),
            status: props.status,
            service: props.service || '',
            token: props.txData[0].token === 'cdai' ? 'DAI' : props.txData[0].token.toUpperCase(),
            method: this.getMethodName(props.txData, props.service),
            option: this.getOption(props.txData, props.service),
            icon: this.getIcon(props.txData, props.service),
            latex: StyleUtilities.minusOrPlusIcon(props.txData[0].type, props.txData[0].direction)
        }
    }

    componentDidMount() {
      LogUtilities.toDebugScreen('TDC componentDidMount', this.state)
    }

    getMethodName(txData, service) {
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return 'Withdraw'
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return 'Swap'
        case 'Contract Creation':
          return 'Contract Creation'
        case 'Compound':
        case '':
        default:
          return this.prefixUpperCase(
            txData[0].type === 'transfer'
            ? txData[0].direction
            : txData[0].type
          )
      }
    }

    getOption(txData, service) {
      LogUtilities.toDebugScreen('Transaction Detail Container getOption', service);
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return this.getPTOption(txData)
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return this.getSwapOption(txData)
        case 'Contract Creation':
        case 'Compound':
        case '':
        default:
          return ''
      }
    }

    getIcon(txData, service) {
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return this.setIconStyle(txData[0].type, txData[0].direction)
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return this.setIconStyle(txData[1].type, txData[1].direction)
        case 'Contract Creation':
          return this.setIconStyle(txData[0].type, txData[0].direction)
        case 'Compound':
        case '':
        default:
          return this.setIconStyle(txData[0].type, txData[0].direction)
      }
    }

    getPTOption(txData) {
      const open = this.pooltogetherAmount(txData, 'open deposit withdraw')
      const committed = this.pooltogetherAmount(txData, 'committed deposit withdraw')
      const sponsor = this.pooltogetherAmount(txData, 'sponsorship withdraw')
      return {
        open,
        committed,
        sponsor,
        sum: parseFloat(open) + parseFloat(committed) + parseFloat(sponsor)
      }
    }

    getSwapOption = txData => ({eth: txData[0].amount, dai : txData[1].tokens_bought})

    setIconStyle = (type, direction) => StyleUtilities.inOrOutIcon(type, direction)

    pooltogetherAmount(txData, type) {
      for(const element of txData)
        if(element.type === type)
          return element.amount
      return '0.00'
    }

    prefixUpperCase = txType => txType.charAt(0).toUpperCase() + txType.slice(1)

    render() {
        const { timestamp, service, status, method, option, icon, token } = this.state
        const { name, size, color } = this.state.latex
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
            ? <>
                <SubtotalSwapBox>
                    <HeaderFive>Sold</HeaderFive>
                    <SoldBox>
                      <Icon name="minus" size={26} color="#F1860E" /><GoyemonText fontSize={24}>{option.eth}ETH</GoyemonText>
                    </SoldBox>
                    <HeaderFive>Bought</HeaderFive>
                    <BoughtBox>
                      <Icon name="plus" size={26} color="#1BA548" /><GoyemonText fontSize={24}>{option.dai}DAI</GoyemonText>
                    </BoughtBox>
                </SubtotalSwapBox>
              </>
            : method === 'Contract Creation'
            ? <>
                  {this.state.txData[0].amount && <SubtotalBox>
                    <Icon name={name} size={size + 10} color={color} />
                    <GoyemonText fontSize={24}>
                      {this.state.txData[0].amount}
                      {token}
                    </GoyemonText>
                  </SubtotalBox>}
                </>
            :   <>
                  {this.state.txData[0].amount && <SubtotalBox>
                    <Icon name={name} size={size + 10} color={color} />
                    <GoyemonText fontSize={24}>
                      {this.state.txData[0].amount}
                      {this.state.txData[0].token === 'cdai' ? ' DAI' : this.state.txData[0].token.toUpperCase()}
                    </GoyemonText>
                  </SubtotalBox>}
                  {this.state.txData[0].type === 'swap' && <SubtotalBox>
                    <Icon name="plus" size={26} color="#1BA548" />
                    <GoyemonText fontSize={24}>{this.state.txData[0].tokens_bought} DAI</GoyemonText>
                  </SubtotalBox>}
                </>}
                <HorizontalLine borderColor="rgba(95, 95, 95, .2)"/>
                </>)
    }
}

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

  componentDidMount() {
    LogUtilities.toDebugScreen('TransactionDetailHeader componentDidMount', this.props);
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
