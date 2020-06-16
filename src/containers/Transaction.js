'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
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
          this.setState({ children: this.computeChildren(x) });
        });
  }

  computeChildren(tx) {
    const data = this.computeTxData(tx);
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
            this.props.onTxTapped(tx);
          // } else {
          //   return null;
          // }
        }}
      >
        <TransactionList>
          <InOrOutTransactionContainer>
            <GoyemonText fontSize={16}>
              {(() => {
                switch (data.type) {
                  case 'swap':
                    return (
                      <Icon name="swap-horizontal" size={20} color="#5F5F5F" />
                    );

                  case 'transfer':
                    if (data.direction == 'self')
                      return (
                        <Icon name="arrow-collapse" size={20} color="#5F5F5F" />
                      );
                    else if (data.direction == 'outgoing')
                      return (
                        <Icon
                          name="arrow-top-right-bold-outline"
                          size={20}
                          color="#F1860E"
                        />
                      );
                    return (
                      <Icon
                        name="arrow-bottom-left-bold-outline"
                        size={20}
                        color="#1BA548"
                      />
                    );

                  case 'approval':
                  case 'deposit':
                    return (
                      <Icon
                        name="arrow-top-right-bold-outline"
                        size={20}
                        color="#F1860E"
                      />
                    );

                  case 'withdraw':
                    return (
                      <Icon
                        name="arrow-bottom-left-bold-outline"
                        size={20}
                        color="#1BA548"
                      />
                    );

                  case 'failure':
                    return (
                      <Icon
                        name="alert-circle-outline"
                        size={20}
                        color="#E41B13"
                      />
                    );
                }
              })()}
            </GoyemonText>
          </InOrOutTransactionContainer>

          <TypeTimeContainer>
            <Type>
              <GoyemonText fontSize={18}>
                {(() => {
                  switch (data.type) {
                    case 'contract_creation':
                      return 'Contract creation';
                    case 'multicontract':
                      return 'Multi';
                    case 'approval':
                      return I18n.t('history-approve');
                    case 'deposit':
                      return I18n.t('deposit');
                    case 'withdraw':
                      return I18n.t('withdraw');
                    case 'rewarded':
                      return 'Rewarded';
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
              switch (data.type) {
                case 'deposit':
                  return <Icon name="minus" size={16} color="#F1860E" />;

                case 'transfer':
                  return data.direction == 'self' ? (
                    <Icon name="plus-minus" size={16} color="#5F5F5F" />
                  ) : data.direction == 'outgoing' ? (
                    <Icon name="minus" size={16} color="#F1860E" />
                  ) : (
                    <Icon name="plus" size={16} color="#1BA548" />
                  );

                case 'rewarded':
                case 'withdraw':
                  return <Icon name="plus" size={16} color="#1BA548" />;

                case 'swap':
                case 'approval':
                case 'failure':
                  return null;
              }
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
								return <GoyemonText fontSize={16}>Contract Creation</GoyemonText>;
							*/
            })()}
          </ValueContainer>
        </TransactionList>
      </TouchableCardContainer>
    );
  }

  computeTxData(tx) {
    if (!tx) return null;

    const our_reasonably_stored_address = (this.props.checksumAddress.substr(
      0,
      2
    ) == '0x'
      ? this.props.checksumAddress.substr(2)
      : this.props.checksumAddress
    ).toLowerCase();

    const topType = (top, toptok) => {
      if (
        top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.eth2tok
          ] ||
        top instanceof
          TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.U2swap]
      )
        return {
          type: 'swap',
          eth_sold: parseFloat(
            TransactionUtilities.parseEthValue(`0x${top.eth_sold}`)
          ).toFixed(4),
          tokens_bought: TransactionUtilities.parseHexDaiValue(
            `0x${top.tok_bought}`
          ),
          token: toptok
        };

      if (
        top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTdeposited
          ] ||
        top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTdepositedAndCommitted
          ] ||
        top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTsponsorshipDeposited
          ]
      )
        return {
          type: 'deposit',
          amount: TransactionUtilities.parseHexDaiValue(
            `0x${top.depositPoolAmount}`
          ),
          token: 'DAI'
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.transfer]
      )
        return {
          type: 'transfer',
          amount: TransactionUtilities.parseHexDaiValue(`0x${top.amount}`),
          direction:
            top.from_addr === our_reasonably_stored_address
              ? top.to_addr === our_reasonably_stored_address
                ? 'self'
                : 'outgoing'
              : top.to_addr === our_reasonably_stored_address
              ? 'incoming'
              : 'unknown',
          token: toptok
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.failure]
      )
        return {
          type: 'failure',
          failop:
            parseInt(top.info, 16) == 38
              ? 'mint'
              : Array.from([42, 45, 46]).contains(parseInt(top.info, 16))
              ? 'redeem'
              : 'unknown',
          token: toptok
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.approval]
      )
        return {
          type: 'approval',
          token: toptok
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.mint]
      )
        return {
          type: 'deposit',
          amount: TransactionUtilities.parseHexDaiValue(
            `0x${top.mintUnderlying}`
          ),
          token: toptok
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.redeem]
      )
        return {
          type: 'withdraw',
          amount: TransactionUtilities.parseHexDaiValue(
            `0x${top.redeemUnderlying}`
          ),
          token: toptok
        };

      if (
        top instanceof
        TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.PTrewarded]
      )
        return {
          type: 'rewarded',
          amount: TransactionUtilities.parseHexDaiValue(`0x${top.winnings}`),
          token: toptok
        };

      return {
        type: 'oops'
      };
    };

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

    return topType(top, toptok);
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
