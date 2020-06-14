'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, Linking, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import {
  saveTxDetailModalVisibility
} from '../actions/ActionModal';
import {
  Container,
  HeaderOne,
  HeaderTwo,
  Button,
  GoyemonText,
  IsOnlineMessage,
  TransactionStatus,
  ModalHandler
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
import GlobalConfig from '../config.json';
import Slider from '@react-native-community/slider';

const mapChecksumAddressStateToProps = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});

const mapGasPriceStateToProps = (state) => ({
  gasPrice: state.ReducerGasPrice.gasPrice
});

const mapIsOnlineAndModalStateToProps = (state) => ({
  isOnline: state.ReducerNetInfo.isOnline,
  modal: state.ReducerModal.modal
});

const mapDispatchToProps = {
  saveTxDetailModalVisibility
};

const TransactionDetail = connect(mapChecksumAddressStateToProps)(
  class TransactionDetail extends Component {
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
          <Container
            alignItems="center"
            flexDirection="row"
            justifyContent="center"
            marginTop={0}
            width="100%"
          >
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
            <GoyemonText fontSize={12}>
              {TransactionUtilities.parseTransactionTime(
                this.props.tx.getTimestamp()
              )}
            </GoyemonText>
            <TransactionStatus
              width="100%"
              txState={this.props.tx.getState()}
            />
          </Container>
          <GoyemonText fontSize={12}>From</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getFrom()}</GoyemonText>

          <GoyemonText fontSize={12}>To</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getTo()}</GoyemonText>

          <GoyemonText fontSize={12}>Value</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getValue()}</GoyemonText>

          <GoyemonText fontSize={12}>gasPrice</GoyemonText>
          <GoyemonText fontSize={12}>{this.props.tx.getGasPrice()}</GoyemonText>

          <GoyemonText fontSize={12}>
            {JSON.stringify(this.state.txData, null, 1)}
            {JSON.stringify(this.props.tx)}
          </GoyemonText>

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
        </>
      );
    }
  }
);

const MagicalGasPriceSlider = connect(mapGasPriceStateToProps)(
  class MagicalGasPriceSlider extends Component {
    constructor(props) {
      super(props);
      this.state = this.getPriceState(this.props.currentGasPrice);
      props.gasPrice.forEach((x) => {
        if (x.speed == 'super fast')
          this.state.maxPrice = Math.ceil(x.value * 1.2);
      });
    }

    getPriceState(price) {
      return {
        usdValue: TransactionUtilities.getTransactionFeeEstimateInUsd(
          price,
          this.props.gasAmount
        ),
        ethValue: parseFloat(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            price,
            this.props.gasAmount
          )
        ).toFixed(5)
      };
    }

    sliderValueChange(v) {
      this.setState(this.getPriceState(v));
    }

    render() {
      //<GoyemonText fontSize={12}>{JSON.stringify(this.props.gasPrice)} -- {JSON.stringify(this.props.currentGas)}</GoyemonText>;
      return (
        <>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="24">
            Choose a new network fee
          </HeaderTwo>
          <Explanation>
            <GoyemonText fontSize={12}>
              *you can speed up your transaction by adding more fees
            </GoyemonText>
          </Explanation>
          <Slider
            value={this.props.currentGasPrice}
            minimumValue={this.props.currentGasPrice}
            maximumValue={this.state.maxPrice}
            onValueChange={this.sliderValueChange.bind(this)}
            onSlidingComplete={this.props.onSettle}
            minimumTrackTintColor="#00A3E2"
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 32,
              marginBottom: 16
            }}
          />
          <NetworkFeeContainer>
            <GoyemonText fontSize={20}>{this.state.ethValue} ETH</GoyemonText>
            <GoyemonText fontSize={20}>{this.state.usdValue} USD</GoyemonText>
          </NetworkFeeContainer>
        </>
      );
    }
  }
);

const NetworkFeeContainer = styled.View`
  align-items: center;
  margin-bottom: 16;
`;

const Explanation = styled.View`
  align-items: center;
`;

const TransactionDetailModal = connect(mapIsOnlineAndModalStateToProps, mapDispatchToProps)(
  class TransactionDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txToUpdate: null,
      newGasPrice: null
    };
  }

  handleViewRef = ref => this.view = ref;

  componentDidUpdate(prevProps) {
    if (this.props.txToUpdate !== prevProps.txToUpdate) {
      const newState = { txToUpdate: this.props.txToUpdate };
      if (this.props.txToUpdate != null)
        newState.newGasPrice = parseInt(
          this.props.txToUpdate.getGasPrice(),
          16
        );

      this.setState(newState);
    }
  }

  async resendTx() {
    // update gas
    const newTx = this.state.txToUpdate.deepClone();
    newTx.setGasPrice(this.state.newGasPrice.toString(16));

    if (await TxStorage.storage.updateTx(newTx))
      await TransactionUtilities.sendTransactionToServer(newTx);
  }

  priceSliderSettled(value) {
    LogUtilities.dumpObject('priceSliderSettled() value', value);
    this.setState({
      newGasPrice: value
    });
  }

  fadeOutUp() {
    this.view
    .fadeOutUp(800)
    .then((endState) =>
      console.log(
        endState.finished ? 'fadeOutUp finished' : 'fadeOutUp cancelled'
      )
    );
  }
    
  renderSpeedUpMessage() {
    return(
      <AnimationContainer>
        <CopyAnimation animation="fadeOutUp" iterationCount={0} direction="normal" ref={this.handleViewRef}><Text>you speeded up transaction!</Text>🚀</CopyAnimation>
      </AnimationContainer>
    );
  }

  render() {
    if (this.state.txToUpdate != null){
      return (
        <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={this.props.modal.txDetailModalVisibility}
          swipeDirection="down"
          onBackdropPress={() => {
            this.props.saveTxDetailModalVisibility(false);
            this.props.onClose()
          }}
          onSwipeComplete={() => {
            this.props.saveTxDetailModalVisibility(false);
            this.props.onClose()
          }}
          style={{
            marginLeft: 4,
            marginRight: 4,
            marginBottom: 0,
            flexDirection: 'row',
            alignItems: 'flex-end'
          }}
        >
          <ModalContainer>
              <TransactionDetail tx={this.state.txToUpdate} />
            <ModalHandler />
            {this.state.txToUpdate.getState() <
            TxStorage.TxStates.STATE_INCLUDED ? (
              <>
                <MagicalGasPriceSlider
                  currentGasPrice={parseInt(
                    this.state.txToUpdate.getGasPrice(),
                    16
                  )}
                  gasAmount={parseInt(this.state.txToUpdate.getGas(), 16)}
                  onSettle={this.priceSliderSettled.bind(this)}
                />
                <Button
                  text="Speed Up Transaction"
                  textColor="#00A3E2"
                  backgroundColor="#FFF"
                  borderColor="#00A3E2"
                  margin="16px auto"
                  marginBottom="40px"
                  opacity="1"
                  disabled={false}
                  onPress={() => {
                    if (this.props.isOnline) {
                      this.resendTx.bind(this);
                      this.props.saveTxDetailModalVisibility(false);
                      this.fadeOutUp();
                    }
                  }}
                />
                {this.renderSpeedUpMessage()}
                <IsOnlineMessage isOnline={this.props.isOnline} />
              </>
            ) : null}
          </ModalContainer>
        </Modal>
      );

    return null;
  }
}

const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
`;

const AnimationContainer = styled.View`
  align-items: center;
  width: 100%;
`;

const CopyAnimation = Animatable.createAnimatableComponent(styled.Text``);

export default connect(mapChecksumAddressStateToProps)(
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
      this.setState({ editedTx: tx });
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
