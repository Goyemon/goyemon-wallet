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
            service: props.service,
            token: props.txData[0].token === 'cdai' ? 'DAI' : props.txData[0].token.toUpperCase(),
            method: this.getMethodName(props.txData, props.service),
            option: this.getOption(props.txData, props.service),
            button: this.getButton(props.txData, props.service)
        }
    }

    componentDidMount() {
      LogUtilities.toDebugScreen('TDC componentDidMount', this.state)
    }

    getMethodName(txData, service) {
      if (!service) return
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return 'Withdraw'
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return 'Swap'
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
      LogUtilities.toDebugScreen('Transaction Detail Container getOption');
      if (!service) return
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return this.getPTOption(txData)
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return this.getSwapOption(txData)
        case 'Compound':
        case '':
        default:
          return ''
      }
    }

    getButton(txData, service) {
      if (!service) return
      switch(service) {
        case 'PoolTogether':
          if (txData.length === 3)
            for (const element of txData)
              if (element.type == 'committed deposit withdraw')
                return this.setIconStyle(txData[0].type, txData[0].direction)
        case 'Uniswap':
          if (txData.length == 2 && txData[1].type == 'swap')
                return this.setIconStyle(txData[1].type, txData[1].direction)
        case 'Compound':
        case '':
        default:
          return ''
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

    getSwapOption(txData) {
      return {
        eth: txData[0].amount,
        dai : txData[1].tokens_bought
      }
    }

    setIconStyle(type, direction) {
      const { name, size, color } = StyleUtilities.inOrOutIcon(type, direction)
      return { name, size, color }
    }

    pooltogetherAmount(txData, type) {
      for(const element of txData)
        if(element.type === type)
          return element.amount
      return '0.00'
    }

    prefixUpperCase = txType =>
      txType.charAt(0).toUpperCase() + txType.slice(1)

    render() {
        const { timestamp, status, method, option } = this.state
        const { name, size, color } = this.state.button
        return (
            <>
            {(() => {
                if (this.state.txData.length === 3)
                  for (const element of this.state.txData)
                    if (element.type == 'committed deposit withdraw')
                      return true
                return false
              })()
            ? <>
                <TransactionDetailHeader
                  name={name}
                  size={size}
                  color={color}
                  timestamp={timestamp}
                  status={status}
                  method={method}
                />
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
                <HorizontalLine />
              </>
            : this.state.txData.length == 2 && this.state.txData[1].type == 'swap'
            ? <>
                <TransactionDetailHeader
                  name={name}
                  size={size}
                  color={color}
                  timestamp={timestamp}
                  status={status}
                  method={method}
                />
                <SubtotalSwapBox>
                    <HeaderFive>Sold</HeaderFive>
                    <SoldBox>
                      <Icon name="minus" size={26} color="#F1860E" /><GoyemonText fontSize={24}>{option.eth}ETA</GoyemonText>
                    </SoldBox>
                    <HeaderFive>Bought</HeaderFive>
                    <BoughtBox>
                      <Icon name="plus" size={26} color="#1BA548" /><GoyemonText fontSize={24}>{option.dai}DAI</GoyemonText>
                    </BoughtBox>
                </SubtotalSwapBox>
                <HorizontalLine borderColor="rgba(95, 95, 95, .2)"/>
              </>
            : (() => {
                if (this.state.txData && this.state.txData.length > 1) {
                    if(this.state.txData[1].direction === 'creation')
                      return true
                    else
                      return false
                }
                else
                  return false
              })()
            ? <>
                <TxDetailHeader>
                    <TxIcon>
                      {(() => {
                        const { name, size, color } = StyleUtilities.inOrOutIcon(this.state.txData[0].type, this.state.txData[0].direction)
                        return <Icon name={name} size={size + 8} color={color}/>
                      })()}
                    </TxIcon>
                    <TypeAndTime>
                      <GoyemonText fontSize={18}>
                        Contract Creation
                      </GoyemonText>
                      <GoyemonText fontSize={15}>
                        {TransactionUtilities.parseTransactionTime(
                          this.props.timestamp
                        )}
                      </GoyemonText>
                    </TypeAndTime>
                    <HeaderStatus>
                      <TransactionStatus
                        width="100%"
                        txState={this.props.status}
                      />
                    </HeaderStatus>
                  </TxDetailHeader>
                  {this.state.txData[0].amount && <SubtotalBox>
                    {(() => {
                        const { name, size, color } = StyleUtilities.minusOrPlusIcon(this.state.txData[0].type, this.state.txData[0].direction)
                        return (
                        name === ''
                        ? null
                        : <Icon name={name} size={size + 10} color={color} />
                    )})()}
                    <GoyemonText fontSize={24}>
                      {this.state.txData[0].amount}
                      {this.state.txData[0].token === 'cdai' ? ' DAI' : this.state.txData[0].token.toUpperCase()}
                    </GoyemonText>
                  </SubtotalBox>}
                  {this.state.txData[0].type === 'swap' && <SubtotalBox>
                    <Icon name="plus" size={26} color="#1BA548" />
                    <GoyemonText fontSize={24}>{this.state.txData[0].tokens_bought} DAI</GoyemonText>
                  </SubtotalBox>}
                  <HorizontalLine />
                </>
            :   <>
                  <TxDetailHeader>
                    <TxIcon>
                      {(() => {
                        const { name, size, color } = StyleUtilities.inOrOutIcon(this.state.txData[0].type, this.state.txData[0].direction)
                        return <Icon name={name} size={size + 8} color={color}/>
                      })()}
                    </TxIcon>
                    <TypeAndTime>
                      <GoyemonText fontSize={18}>
                        {this.prefixUpperCase(
                          this.state.txData[0].type === 'transfer'
                          ? this.state.txData[0].direction
                          : this.state.txData[0].type
                        )}
                      </GoyemonText>
                      <GoyemonText fontSize={15}>
                        {TransactionUtilities.parseTransactionTime(
                          this.props.timestamp
                        )}
                      </GoyemonText>
                    </TypeAndTime>
                    <HeaderStatus>
                      <TransactionStatus
                        width="100%"
                        txState={this.props.status}
                      />
                    </HeaderStatus>
                  </TxDetailHeader>
                  {this.state.txData[0].amount && <SubtotalBox>
                    {(() => {
                        const { name, size, color } = StyleUtilities.minusOrPlusIcon(this.state.txData[0].type, this.state.txData[0].direction)
                        return (
                        name === ''
                        ? null
                        : <Icon name={name} size={size + 10} color={color} />
                    )})()}
                    <GoyemonText fontSize={24}>
                      {this.state.txData[0].amount}
                      {this.state.txData[0].token === 'cdai' ? ' DAI' : this.state.txData[0].token.toUpperCase()}
                    </GoyemonText>
                  </SubtotalBox>}
                  {this.state.txData[0].type === 'swap' && <SubtotalBox>
                    <Icon name="plus" size={26} color="#1BA548" />
                    <GoyemonText fontSize={24}>{this.state.txData[0].tokens_bought} DAI</GoyemonText>
                  </SubtotalBox>}
                  <HorizontalLine borderColor="rgba(95, 95, 95, .2)"/>
                </>}
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
      name: props.name,
      size: props.size,
      color: props.color,
      timestamp: props.timestamp,
      status: props.status,
      method: props.method
    }
  }

  componentDidMount() {
    LogUtilities.toDebugScreen('TransactionDetailHeader componentDidMount', this.props);
  }

  render() {
    const { name, size, color, timestamp, status, method } = this.state
    return (
      <TxDetailHeader>
        <TxIcon>
          <Icon name={"swap-horizontal"} size={20 + 8} color={"#5F5F5F"}/>
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
