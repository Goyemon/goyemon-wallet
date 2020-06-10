'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, Modal, Linking } from 'react-native';
import styled from 'styled-components';
import {
  HeaderOne,
  TxConfirmationButton,
  GoyemonText
} from '../components/common';
import { connect } from 'react-redux';

// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import OfflineNotice from './common/OfflineNotice';
import TransactionList from './TransactionList';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';
import TransactionUtilities from '../utilities/TransactionUtilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TxSpeedSelectionContainer } from './common/AdvancedContainer';
import GlobalConfig from '../config.json';

const propsToStateChecksumAddr = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

const TransactionDetail = connect(propsToStateChecksumAddr)(
  class TransactionDetail extends Component {
    // separated so we can reuse the same display in other places
    constructor(props) {
      super(props);
      this.state = {
        txData: this.computeTxData(props.tx)
      };
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
          TxStorage.TxTokenOpNameToClass[TxStorage.TxTokenOpTypeToName.eth2tok]
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
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTrewarded
          ]
        )
          return {
            type: 'rewarded',
            amount: TransactionUtilities.parseHexDaiValue(`0x${top.winnings}`),
            token: toptok
          };

        if (
          top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTwithdrawn
          ]
        )
          return {
            type: 'withdraw',
            token: toptok,
            amount: TransactionUtilities.parseHexDaiValue(
              `0x${x.withdrawAmount}`
            )
          };

        if (
          top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTopenDepositWithdrawn
          ]
        )
          return {
            type: 'open deposit withdraw',
            token: toptok,
            amount: TransactionUtilities.parseHexDaiValue(
              `0x${x.withdrawAmount}`
            )
          };

        if (
          top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTsponsorshipAndFeesWithdrawn
          ]
        )
          return {
            type: 'sponsorship withdraw',
            token: toptok,
            amount: TransactionUtilities.parseHexDaiValue(
              `0x${x.withdrawAmount}`
            )
          };

        if (
          top instanceof
          TxStorage.TxTokenOpNameToClass[
            TxStorage.TxTokenOpTypeToName.PTcommittedDepositWithdrawn
          ]
        )
          return {
            type: 'committed deposit withdraw',
            token: toptok,
            amount: TransactionUtilities.parseHexDaiValue(
              `0x${x.withdrawAmount}`
            )
          };

        return {
          type: 'oops'
        };
      };

      const ret = [];

      if (tx.getTo() == null)
        return [
          {
            type: 'contract_creation'
          }
        ];

      if (tx.getValue() != '00') {
        const ethdirection =
          (tx.getFrom() && tx.getFrom() === `0x${our_reasonably_stored_address}`
            ? 1
            : 0) +
          (tx.getTo() && tx.getTo() === `0x${our_reasonably_stored_address}`
            ? 2
            : 0);

        if (ethdirection > 0)
          ret.push({
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
          });
      }

      Object.entries(tx.getAllTokenOperations()).forEach(
        ([toptok, toktops]) => {
          // toptok - TokenOP Token, toktops -> (given) token TokenOPs ;-)
          toktops.forEach((x) => ret.push(topType(x, toptok)));
        }
      );

      return ret;
    }

    componentDidUpdate(prevProps) {
      if (this.props.tx !== prevProps.tx)
        this.setState({ txData: this.computeTxData(this.props.tx) });
    }

    render() {
      if (!this.state.txData)
        return <GoyemonText fontSize={12}>nothink!</GoyemonText>;

      // return <GoyemonText fontSize={12}>{JSON.stringify(this.state.txData, null, 1)}{JSON.stringify(this.props.tx)}</GoyemonText>;

      return (
        <>
          {this.state.txData.map((x) => {
            return (
              <>
                <GoyemonText fontSize={12}>{x.type}</GoyemonText>
                {x.direction ? (
                  <GoyemonText fontSize={12}>{x.direction}</GoyemonText>
                ) : null}
                {x.amount ? (
                  <GoyemonText fontSize={12}>
                    {x.amount}
                    {x.token}
                  </GoyemonText>
                ) : null}
              </>
            );

            switch (x.type) {
            }
          })}
          <GoyemonText fontSize={12}>Status</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getState()}</GoyemonText>

          <GoyemonText fontSize={12}>Hash</GoyemonText>
          <GoyemonText
            fontSize={12}
            onPress={() => {
              Linking.openURL(
                `${GlobalConfig.EtherscanLink}${'0x' + this.props.tx.getHash()}`
              ).catch((err) => LogUtilities.logError('An error occurred', err));
            }}
          >
            {'0x' + this.props.tx.getHash()}
            <Icon name="link-variant" size={16} color="#5f5f5f" />
          </GoyemonText>

          <GoyemonText fontSize={12}>From</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getFrom()}</GoyemonText>

          <GoyemonText fontSize={12}>To</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getTo()}</GoyemonText>

          <GoyemonText fontSize={12}>Value</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getValue()}</GoyemonText>

          <GoyemonText fontSize={12}>gasPrice</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getGasPrice()}</GoyemonText>

          <GoyemonText fontSize={12}>gas</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getGas()}</GoyemonText>

          <GoyemonText fontSize={12}>nonce</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getNonce()}</GoyemonText>

          <GoyemonText fontSize={12}>
            {JSON.stringify(this.state.txData, null, 1)}
            {JSON.stringify(this.props.tx)}
          </GoyemonText>
        </>
      );
    }
  }
); // connect()

class TransactionDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txToUpdate: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.txToUpdate !== prevProps.txToUpdate)
      this.setState({ txToUpdate: this.props.txToUpdate });
  }

  async resendTx() {
    // update gas
    const newTx = this.state.txToUpdate.deepClone();
    newTx.setGasPrice(
      TransactionUtilities.returnTransactionSpeed(2).toString(16)
    );

    await TxStorage.storage.updateTx(newTx); // temporarily no if
    await TransactionUtilities.sendTransactionToServer(newTx);

    // if (await TxStorage.storage.updateTx(newTx))
    // 	await TransactionUtilities.sendTransactionToServer(newTx);
  }

  render() {
    if (this.state.txToUpdate != null)
      return (
        <Modal animationType="slide" transparent visible={true}>
          <ModalContainer>
            <ModalBackground>
              <CloseButton
                onPress={() => {
                  this.props.onClose();
                }}
              >
                <Icon name="chevron-down" color="#5F5F5F" size={24} />
              </CloseButton>

              <TxSpeedSelectionContainer
                gasLimit={parseInt(this.state.txToUpdate.getGas(), 16)}
                expandByDefault={true}
              />

              <TxConfirmationButton
                text={'Resend (needs i18n)'}
                onPress={this.resendTx.bind(this)}
              />

              <GoyemonText fontSize={12}>TX data:</GoyemonText>
              <TransactionDetail tx={this.state.txToUpdate} />
            </ModalBackground>
          </ModalContainer>
        </Modal>
      );

    return null;
  }
}

const ModalContainer = styled.View`
  align-items: flex-end;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #fff;
  border-radius: 16px;
  min-height: 200px;
  width: 98%;
`;
const CloseButton = styled.TouchableOpacity`
  margin-left: 16;
  margin-top: 16;
`;

export default connect(propsToStateChecksumAddr)(
  class History extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filter: 'All',
        editedTx: null
      };
    }

    toggleFilterChoiceText() {
      const choices = ['All', 'Dai'].map((filter) => {
        if (filter === this.state.filter)
          return (
            <FilterChoiceTextSelected key={filter}>
              {filter}
            </FilterChoiceTextSelected>
          );

        return (
          <TouchableOpacity
            key={filter}
            onPress={() => this.setState({ filter })}
          >
            <FilterChoiceTextUnselected>{filter}</FilterChoiceTextUnselected>
          </TouchableOpacity>
        );
      });

      return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
    }

    txTapped(tx) {
      LogUtilities.dumpObject('tx', tx);
      // if (tx.getState() < TxStorage.TxStates.STATE_INCLUDED) {
      // this.props.saveTxConfirmationModalVisibility(true);
      //   this.props.updateTxConfirmationModalVisibleType('i like pancakes');
      this.setState({ editedTx: tx });
      // }
    }

    txClear() {
      this.setState({ editedTx: null });
    }

    render() {
      return (
        <HistoryContainer>
          <TransactionDetailModal
            txToUpdate={this.state.editedTx}
            onClose={this.txClear.bind(this)}
          />
          <OfflineNotice />
          <HeaderOne marginTop="64">{I18n.t('history')}</HeaderOne>
          {this.toggleFilterChoiceText()}
          <TransactionList
            checksumAddress={this.props.checksumAddress}
            onTxTapped={this.txTapped.bind(this)}
            tokenFilter={this.state.filter}
            key={`TransactionList_${this.state.filter}`}
          />
        </HistoryContainer>
      );
    }
  }
);

const HistoryContainer = styled.View`
  background: #f8f8f8;
  height: 100%;
`;

const FilterChoiceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 24;
  margin-bottom: 12;
  margin-left: 16;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #000;
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  text-transform: uppercase;
`;

const FilterChoiceTextUnselected = styled.Text`
  font-size: 24;
  font-weight: bold;
  margin-right: 12;
  opacity: 0.4;
  text-transform: uppercase;
`;
