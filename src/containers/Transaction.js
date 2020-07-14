'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import EtherUtilities from '../utilities/EtherUtilities';
import { saveTxDetailModalVisibility } from '../actions/ActionModal';
import {
  GoyemonText,
  TouchableCardContainer,
  TransactionStatus
} from '../components/common';
import TxStorage from '../lib/tx.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import LogUtilities from '../utilities/LogUtilities';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      children: <GoyemonText fontSize={12}>...</GoyemonText>
    };
  }

  componentDidMount() {
    const filter = TransactionUtilities.getFilter(this.props.transaction.filter)
    TxStorage.storage
      .getTx(this.props.transaction.index, filter)
      .then((x) => {
        this.setState({ children: this.computeChildren(x) });
      });
  }

  componentDidUpdate(prevProps) {
    const filter = TransactionUtilities.getFilter(this.props.transaction.filter)
    if (this.props.updateCounter !== prevProps.updateCounter)
      TxStorage.storage
        .getTx(this.props.transaction.index, filter)
        .then((x) => {
          this.setState({ children: this.computeChildren(x) });
        });
  }

  computeChildren(tx) {
    const data = TransactionUtilities.txCommonObject(tx, EtherUtilities.getReasonablyAddress(this.props.checksumAddress))
    const { index, filter } = this.props.transaction
    const { timestamp, status, service, amount, token, icon, inOrOut, option } = data
    let { method } = data
    LogUtilities.toDebugScreen('CC inOrOut', timestamp, service, method, amount)
    if (service === 'PoolTogether' || service === 'Uniswap') {
      if (!option && method === 'Withdraw')
        method = 'Outgoing'
      if (!option && method === 'Swap')
        method = 'Outgoing'
    }

    return (
      <TouchableCardContainer
        alignItems="center"
        borderRadius="0"
        flexDirection="row"
        height="80px"
        justifyContent="center"
        marginTop="0"
        textAlign="left"
        width="90%"
        onPress={() => {
          // if (tx.getState() === 0 || tx.getState() === 1) {
            this.props.saveTxDetailModalVisibility(true);
            this.props.onTxTapped(tx, index, filter);
          // } else {
          //   return null;
          // }
        }}
      >
        <TransactionList>
          <InOrOutTransactionContainer>
            <GoyemonText fontSize={16}>
              {icon.name !== '' &&
                <Icon name={icon.name} size={icon.size} color={icon.color} />
              }
            </GoyemonText>
          </InOrOutTransactionContainer>

          <TypeTimeContainer>
            <Type>
              <GoyemonText fontSize={18}>
                {method}
              </GoyemonText>
            </Type>
            <Time>{timestamp}</Time>
          </TypeTimeContainer>

          <TransactionStatus width="26%" txState={status} />

          <ValueContainer>
            {inOrOut.name !== '' && method !== 'Swap' &&
              <Icon name={inOrOut.name} size={inOrOut.size} color={inOrOut.color} />
            }
            <TransactionAmount
              amount={amount}
              token={token}
              option={option}
              method={method}
            />
          </ValueContainer>
        </TransactionList>
      </TouchableCardContainer>
    );
  }

  render() {
    return this.state.children;
  }
}

const styles = {
  valueStyleRed: {
    color: '#F1860E'
  },
  valueStyleGreen: {
    color: '#1BA548'
  }
};

const TransactionList = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const InOrOutTransactionContainer = styled.View`
  width: 10%;
`;

const TypeTimeContainer = styled.View`
  width: 32%;
`;

const Type = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 4;
`;

const Time = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const ValueContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 32%;
`;

const SwapValueContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const SwapValueTextContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const TransactionAmount = props => {
  const { amount, token, option, method } = props
  switch(method) {
    case 'Deposit':
    case 'Outgoing':
      return <GoyemonText
                fontSize={16}
                style={styles.valueStyleRed}
              >
                {amount} {token}
              </GoyemonText>
    case 'Reward':
    case 'Withdraw':
      if (option)
        return <GoyemonText
                  fontSize={16}
                  style={styles.valueStyleGreen}
               >
                  {option.sum} {token}
               </GoyemonText>
    case 'Incoming':
      return <GoyemonText
                fontSize={16}
                style={styles.valueStyleGreen}
              >
                {amount} {token}
             </GoyemonText>
    case 'Swap':
      return <SwapValueContainer>
              <SwapValueTextContainer>
                <Icon name="minus" size={16} color="#F1860E" />
                <GoyemonText
                  fontSize={16}
                  style={styles.valueStyleGreen}
                >
                  {option.eth} ETH
                </GoyemonText>
              </SwapValueTextContainer>
              <Icon name="swap-vertical" size={16} color="#5f5f5f" />
              <SwapValueTextContainer>
                <Icon name="plus" size={16} color="#1BA548" />
                <GoyemonText
                  fontSize={16}
                  style={styles.valueStyleGreen}
                >
                  {option.dai} DAI
                </GoyemonText>
              </SwapValueTextContainer>
             </SwapValueContainer>
    case 'Self':
      return <GoyemonText fontSize={16}>
              {amount} {token}
             </GoyemonText>
    case 'Failed':
      return <GoyemonText fontSize={16}>0</GoyemonText>
    default:
      return null
  }
}

const mapDispatchToProps = {
  saveTxDetailModalVisibility
};

export default connect(null, mapDispatchToProps)(Transaction);
