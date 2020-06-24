'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import StyleUtilities from '../utilities/StyleUtilities';
import EtherUtilities from '../utilities/EtherUtilities';
import LogUtilities from '../utilities/LogUtilities';
import { saveTxDetailModalVisibility } from '../actions/ActionModal';
import {
  GoyemonText,
  TouchableCardContainer,
  TransactionStatus
} from '../components/common';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      children: <GoyemonText fontSize={12}>...</GoyemonText>
    };
  }

  componentDidMount() {
    TxStorage.storage
      .getTx(this.props.transaction.index, this.props.transaction.filter)
      .then((x) => {
        this.setState({ children: this.computeChildren(x) });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.updateCounter !== prevProps.updateCounter)
      TxStorage.storage
        .getTx(this.props.transaction.index, this.props.transaction.filter)
        .then((x) => {
          LogUtilities.toDebugScreen('Index', this.props.transaction.index, 'Tx', x)
          this.setState({ children: this.computeChildren(x) });
        });
  }

  computeChildren(tx) {
    const data = this.computeTxData(tx);
    const { index, filter } = this.props.transaction
    const time = TransactionUtilities.parseTransactionTime(tx.getTimestamp());

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
            LogUtilities.toDebugScreen('OnPress Index -> ', index, 'Filter -> ', filter);
            this.props.onTxTapped(tx, index, filter);
          // } else {
          //   return null;
          // }
        }}
      >
        <TransactionList>
          <InOrOutTransactionContainer>
            <GoyemonText fontSize={16}>
              {(() => {
                const { name, size, color } = StyleUtilities.inOrOutIcon(data.type, data.direction)
                return <Icon name={name} size={size} color={color} />
              })()}
            </GoyemonText>
          </InOrOutTransactionContainer>

          <TypeTimeContainer>
            <Type>
              <GoyemonText fontSize={18}>
                {(() => {
                  switch (data.type) {
                    case 'contract_creation':
                      return 'Deploy';
                    case 'multicontract':
                      return 'Multi';
                    case 'approval':
                      return I18n.t('history-approve');
                    case 'deposit':
                      return I18n.t('deposit');
                    case 'withdraw':
                      return I18n.t('withdraw');
                    case 'rewarded':
                      return 'Reward';
                    case 'swap':
                      return I18n.t('history-swap');
                    case 'transfer':
                      return data.direction == 'self'
                        ? 'Self'
                        : data.direction == 'outgoing'
                        ? I18n.t('history-outgoing')
                        : I18n.t('history-incoming');
                    case 'failure':
                      return I18n.t('history-failed');
                  }
                })()}
              </GoyemonText>
            </Type>
            <Time>{time}</Time>
          </TypeTimeContainer>

          <TransactionStatus width="26%" txState={tx.getState()} />

          <ValueContainer>
            {(() => {
              const { name, size, color } = StyleUtilities.minusOrPlusIcon(data.type, data.direction)
              return name === ''
              ? null
              : <Icon name={name} size={size} color={color} />
            })()}
            {(() => {
              switch (data.type) {
                case 'deposit':
                  return (
                    <GoyemonText fontSize={16} style={styles.valueStyleRed}>
                      {data.amount} DAI
                    </GoyemonText>
                  );

                case 'transfer':
                  return (
                    <GoyemonText
                      fontSize={16}
                      style={
                        data.direction == 'incoming'
                          ? styles.valueStyleGreen
                          : styles.valueStyleRed
                      }
                    >
                      {data.amount} {data.token.toUpperCase()}
                    </GoyemonText>
                  );

                case 'rewarded':
                case 'withdraw':
                  return (
                    <GoyemonText fontSize={16} style={styles.valueStyleGreen}>
                      {data.amount} DAI
                    </GoyemonText>
                  );

                case 'swap':
                  return (
                    <SwapValueContainer>
                      <SwapValueTextContainer>
                        <Icon name="minus" size={16} color="#F1860E" />
                        <GoyemonText
                          fontSize={16}
                          style={styles.valueStyleGreen}
                        >
                          {data.eth_sold} ETH
                        </GoyemonText>
                      </SwapValueTextContainer>
                      <Icon name="swap-vertical" size={16} color="#5f5f5f" />
                      <SwapValueTextContainer>
                        <Icon name="plus" size={16} color="#1BA548" />
                        <GoyemonText
                          fontSize={16}
                          style={styles.valueStyleGreen}
                        >
                          {data.tokens_bought} DAI
                        </GoyemonText>
                      </SwapValueTextContainer>
                    </SwapValueContainer>
                  );

                case 'approval':
                  return null;

                case 'failure':
                  return <GoyemonText fontSize={16}>0</GoyemonText>;
              }

              /*
								if (this.state.transaction.getFrom() === null)
								return <GoyemonText fontSize={16}>Token Transfer</GoyemonText>;

								if (this.state.transaction.getTo() === null)
								return <GoyemonText fontSize={16}>Deploy</GoyemonText>;
							*/
            })()}
          </ValueContainer>
        </TransactionList>
      </TouchableCardContainer>
    );
  }

  computeTxData(tx) {
    if (!tx) return null;

    const our_reasonably_stored_address = EtherUtilities.getReasonablyAddress(this.props.checksumAddress);

    const isPtWithdraw = (x) =>
      x instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTwithdrawn
        ] ||
      x instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTopenDepositWithdrawn
        ] ||
      x instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn
        ] ||
      x instanceof
        TxStorage.TxTokenOpNameToClass[
          TxStorage.TxTokenOpTypeToName.PTcommittedDepositWithdrawn
        ];

    const tops = tx.getAllTokenOperations();

    if (Object.keys(tops).length == 0) {
      // no token operations.
      if (tx.getTo() == null)
        return {
          type: 'contract_creation'
        };

      const ethdirection =
        (tx.getFrom() && tx.getFrom() === `0x${our_reasonably_stored_address}`
          ? 1
          : 0) +
        (tx.getTo() && tx.getTo() === `0x${our_reasonably_stored_address}`
          ? 2
          : 0);

      if (ethdirection > 0)
        return {
          type: 'transfer',
          direction:
            ethdirection == 1
              ? 'outgoing'
              : ethdirection == 2
              ? 'incoming'
              : 'self',
          amount: parseFloat(
            TransactionUtilities.parseEthValue(`0x${tx.getValue()}`)
          ).toFixed(4),
          token: 'eth'
        };

      return {
        type: 'oops'
      };
    }

    if (
      Object.keys(tops).length > 1 || // two different tokens operated on or
      (Object.values(tops)[0].length > 1 && // more than one token op for givne token,
        (!tops.pooltogether ||
          tops.pooltogether.filter((x) => !isPtWithdraw(x)).length > 0)) // and the token is not pooltogether or it's all withdraws in PT.
    )
      return {
        type: 'multicontract'
      };

    // at this point we should have either single token operation or a bunch of PT withdraws.
    // currently out of known operations, only PT withdraw emits multiple operations normally

    let top, toptok;
    if (tops.pooltogether) {
      if (isPtWithdraw(tops.pooltogether[0])) {
        //TransactionUtilities.parseHexDaiValue(`0x${topdata.reduce((x, y) => x.plus(y.withdrawAmount, 16), new BigNumber(0)).toString(16)}`)
        return {
          type: 'withdraw',
          token: toptok,
          amount: TransactionUtilities.parseHexDaiValue(
            `0x${tops.pooltogether
              .reduce((sum, x) => {
                if (isPtWithdraw(x)) return sum.plus(x.withdrawAmount, 16);

                return sum;
              }, new BigNumber(0))
              .toString(16)}`
          ) // TODO: why do we convert this to hex and then back? wouldnt it be better to just divide the BigNumber by decimal places of DAI?
        };
      }
    }

    [toptok, top] = Object.entries(tops).map(([toptok, toparr]) => [
      toptok,
      toparr[0]
    ])[0]; // changes {x:[1]} to [x, 1], so extracts token name and the first token op (should only be one at this point anyway)

    return EtherUtilities.topType(top, toptok, our_reasonably_stored_address);
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

// const mapStateToProps = (state) => ({
//   checksumAddress: state.ReducerChecksumAddress.checksumAddress
// });

const mapDispatchToProps = {
  saveTxDetailModalVisibility
};

export default connect(null, mapDispatchToProps)(Transaction);
