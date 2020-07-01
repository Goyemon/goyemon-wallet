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

export default class TransactionDetailHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txData: props.txData
        }
    }

    prefixUpperCase = txType =>
      txType.charAt(0).toUpperCase() + txType.slice(1)

    render() {
        return (
            <>
            {this.state.txData.length === 0
            ? <><GoyemonText fontSize={18}>Withdraw</GoyemonText></>
            : (() => {
                if (this.state.txData.length === 3)
                  for (const element of this.state.txData)
                    if (element.type == 'committed deposit withdraw')
                      return true
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
                        Withdraw
                    </GoyemonText>
                    <GoyemonText fontSize={16}>
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
                <SubtotalWithdrawBox>
                  {(() => {
                      const { name, size, color } = StyleUtilities.minusOrPlusIcon(this.state.txData[0].type, this.state.txData[0].direction)
                      return (
                      name === ''
                      ? null
                      : <Icon name={name} size={size + 10} color={color} />
                  )})()}
                  <GoyemonText fontSize={24}>
                  {parseFloat(this.state.txData[0].amount) + parseFloat(this.state.txData[1].amount) + parseFloat(this.state.txData[2].amount)}
                  {this.state.txData[0].token === 'cdai' || this.state.txData[0].token === 'pooltogether' ? ' DAI' : this.state.txData[0].token.toUpperCase()}
                  </GoyemonText>
                  <LabelsBox>
                    <GoyemonText fontSize={14}>Open</GoyemonText>
                    <GoyemonText fontSize={14}>Committed</GoyemonText>
                    <GoyemonText fontSize={14}>Sponsor</GoyemonText>
                  </LabelsBox>
                  <ValueBox>
                    <GoyemonText fontSize={14}>{this.pooltogetherAmount('open deposit withdraw')}DAI</GoyemonText>
                    <GoyemonText fontSize={14}>{this.pooltogetherAmount('committed deposit withdraw')}DAI</GoyemonText>
                    <GoyemonText fontSize={14}>{this.pooltogetherAmount('sponsorship withdraw')}DAI</GoyemonText>
                  </ValueBox>
                </SubtotalWithdrawBox>
                <HorizontalLine />
              </>
            : this.state.txData.length == 2 && this.state.txData[1].type == 'swap'
            ? <>
                <TxDetailHeader>
                  <TxIcon>
                    {(() => {
                      const { name, size, color } = StyleUtilities.inOrOutIcon(this.state.txData[1].type, this.state.txData[1].direction)
                      return <Icon name={name} size={size + 8} color={color}/>
                    })()}
                  </TxIcon>
                  <TypeAndTime>
                    <GoyemonText fontSize={18}>
                        {this.prefixUpperCase(this.state.txData[1].type)}
                    </GoyemonText>
                    <GoyemonText fontSize={16}>
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
                <SubtotalSwapBox>
                    <HeaderFive>Sold</HeaderFive>
                    <SoldBox>
                      {(() => {
                          const { name, size, color } = StyleUtilities.minusOrPlusIcon(this.state.txData[0].type, this.state.txData[0].direction)
                          return (
                          name === ''
                          ? null
                          : <Icon name={name} size={size + 10} color={color} />
                      )})()}
                      <GoyemonText fontSize={24}>
                      {this.state.txData[0].amount}
                      {this.state.txData[0].token === 'cdai' ? 'Dai' : this.state.txData[0].token.toUpperCase()}
                      </GoyemonText>
                    </SoldBox>
                    <HeaderFive>Bought</HeaderFive>
                    <BoughtBox>
                      <Icon name="plus" size={26} color="#1BA548" /><GoyemonText fontSize={24}>{this.state.txData[1].tokens_bought}DAI</GoyemonText>
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
