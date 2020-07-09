'use strict';
import React, { Component } from 'react';
import { TouchableOpacity, Linking, ScrollView, View, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import EtherUtilities from '../utilities/EtherUtilities'
import TransactionDetailContainer from './TransactionDetailContainer'
import Web3 from 'web3';
import { saveTxDetailModalVisibility } from '../actions/ActionModal';
import {
  Container,
  HeaderOne,
  HeaderTwo,
  HeaderFive,
  Button,
  GoyemonText,
  InsufficientWeiBalanceMessage,
  IsOnlineMessage,
  TransactionStatus,
  ModalHandler,
  HorizontalLine,
  Loader
} from '../components/common';
import { connect } from 'react-redux';

// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import Copy from './common/Copy';
import OfflineNotice from './common/OfflineNotice';
import TransactionList from './TransactionList';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx.js';
import LogUtilities from '../utilities/LogUtilities';
import TransactionUtilities from '../utilities/TransactionUtilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalConfig from '../config.json';
import Slider from '@react-native-community/slider';

const window = Dimensions.get("window");

const mapChecksumAddressStateToProps = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
});
const mapGasPriceStateToProps = (state) => ({
  gasPrice: state.ReducerGasPrice.gasPrice
});

const mapAddressAndIsOnlineAndModalStateToProps = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
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
        txData: this.computeTxData(props.tx),
        tx: props.tx
      };
    }

    computeTxData(tx) {
      if (!tx) return null;

      const our_reasonably_stored_address = EtherUtilities.getReasonablyAddress(this.props.checksumAddress);

      const ret = [];

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
          toktops.forEach((x) => ret.push(EtherUtilities.topType(x, toptok, our_reasonably_stored_address)));
        }
      );

      if (tx.getTo()) {
        if (tx.getTo().toLowerCase() === GlobalConfig.DAIPoolTogetherContractV2.toLowerCase() && ret.length === 0)
            ret.push({
              type: 'outgoing',
              token: 'dai',
              direction: 'outgoing',
              amount: '0.00'
            })
      }
      else
        ret.push({
          type: 'Contract Creation',
          direction: 'creation',
          token: 'eth'
        })

      if(ret.length === 0)
        ret.push({
          type: 'Contract Interaction',
          direction: 'outgoing',
          token: 'eth',
          amount: '0.00'
        })

      return ret;
    }

    componentDidMount() {
      LogUtilities.toDebugScreen('TransactionDetail Tx', this.state.tx.tokenData)
      LogUtilities.toDebugScreen('TransactionDetail Tx', this.state.txData)
    }

    async componentDidUpdate(prevProps) {
      if (this.props.updateCounter !== prevProps.updateCounter) {
        TxStorage.storage
        .getTx(this.props.index, this.props.filter)
        .then(async x => {
          await this.setState({ txData: this.computeTxData(x), tx: x });
        })
        .catch(e => LogUtilities.toDebugScreen('TransactionDetail Tx Error With', e));
      }
      await this.props.updateTx(this.state.tx)
    }

    pooltogetherAmount(type) {
      for(const element of this.state.txData)
        if(element.type === type)
          return element.amount
      return '0.00'
    }

    render() {
      if (!this.state.txData)
        return <GoyemonText fontSize={12}>nothink!</GoyemonText>;

      return (
        <>
          <Container
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="flex-start"
            marginTop={0}
            width="100%"
          >
            <TransactionDetailContainer
              txData={this.state.txData}
              timestamp={this.state.tx.getTimestamp()}
              status={this.state.tx.getState()}
              service={this.props.tx.getApplication(this.props.tx.getTo())}
            />
            <TxNetworkAndHash>
              {(() => {
                const app = this.props.tx.getTo() === null ? null : this.props.tx.getApplication(this.props.tx.getTo())
              return (
                app === '' || app === null
              ? null
              : <>
                  <HeaderFive fontSize={20}>Application</HeaderFive>
                  <TxDetailValue>
                    {this.props.tx.getTo() === null ? null : this.props.tx.getApplication(this.props.tx.getTo())}
                  </TxDetailValue>
                </>
              )})()}

              {this.state.txData[0].direction &&
              <>
                {this.state.txData.length === 1 && this.state.txData[0].direction == 'incoming' && this.state.txData[0].type == 'transfer' &&
                <>
                  <HeaderFive fontSize={20}>From</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {this.props.tx.getFrom().substring(0, 24) + '...'}
                    </ToAndFromValue>
                    <Copy text={this.props.tx.getFrom()} icon={false} />
                  </ToAndFromValueContainer>
                </>}

                {this.state.txData.length === 1 && this.state.txData[0].direction == 'outgoing' && this.state.txData[0].type == 'transfer' &&
                <>
                  <HeaderFive fontSize={20}>To</HeaderFive>
                  <ToAndFromValueContainer>
                    <ToAndFromValue>
                      {this.state.txData[0].token === 'eth'
                      ? this.props.tx.getTo().substring(0, 24) + '...'
                      : this.state.tx.tokenData.cdai[0]
                      ? '0x' + this.state.tx.tokenData.cdai[0].to_addr.substring(0, 24) + '...'
                      : '0x' + this.state.tx.tokenData.dai[0].to_addr.substring(0, 24) + '...'}
                    </ToAndFromValue>
                    <Copy text={this.props.tx.getTo()} icon={false} />
                  </ToAndFromValueContainer>
                </>}

              </>}

              <HeaderFive fontSize={20}>Max Network Fee</HeaderFive>
              <TxDetailValue>
                {parseInt(this.props.tx.getGasPrice(), 16) * parseInt(this.props.tx.gas, 16) / 1000000000000000000} ETH
              </TxDetailValue>

              {(() => {
              return (
                this.props.tx.getState() < 1 ? null :
                <View>
                <HeaderFive fontSize={20}>Hash</HeaderFive>
                <TxDetailValue
                    onPress={() => {
                      Linking.openURL(
                        `${GlobalConfig.EtherscanLink}${'0x' + this.props.tx.getHash()}`
                      ).catch((err) => LogUtilities.logError('An error occurred', err));
                    }}
                  >
                    {'0x' + this.props.tx.getHash().substring(0, 24) + '...'}
                    <Icon name="link-variant" size={16} color="#5f5f5f" />
                </TxDetailValue>
                </View>
              )})()}
            </TxNetworkAndHash>
          </Container>
        </>
      );
    }
  }
);

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

const MagicalGasPriceSlider = connect(mapGasPriceStateToProps)(
  class MagicalGasPriceSlider extends Component {
    constructor(props) {
      super(props);
      this.state = {
        weiAmountValidation: undefined
      };
      this.state = this.getPriceState(
        Math.ceil(this.props.currentGasPrice * 1.2)
      );
      props.gasPrice.forEach((x) => {
        if (x.speed == 'super fast')
          this.state.maxPrice = Math.ceil(x.value * 1.2);
      });
    }

    getPriceState(gasPriceWeiDecimal) {
      return {
        usdValue: TransactionUtilities.getTransactionFeeEstimateInUsd(
          gasPriceWeiDecimal,
          this.props.gasLimit
        ),
        ethValue: parseFloat(
          TransactionUtilities.getTransactionFeeEstimateInEther(
            gasPriceWeiDecimal,
            this.props.gasLimit
          )
        ).toFixed(5)
      };
    }

    sliderValueChange(gasPriceWeiDecimal) {
      gasPriceWeiDecimal = Math.floor(gasPriceWeiDecimal);
      this.setState(this.getPriceState(gasPriceWeiDecimal));
    }

    updateWeiAmountValidation(weiAmountValidation) {
      this.props.updateWeiAmountValidationInModal(weiAmountValidation);
      if (weiAmountValidation) {
        this.setState({
          weiAmountValidation: true
        });
      } else if (!weiAmountValidation) {
        this.setState({
          weiAmountValidation: false
        });
      }
    }

    render() {
      //<GoyemonText fontSize={12}>{JSON.stringify(this.props.gasPrice)} -- {JSON.stringify(this.props.currentGas)}</GoyemonText>;
      const minimumGasPrice = Math.ceil(this.props.currentGasPrice * 1.2);

      return (
        <>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="24">
            Choose a new max network fee
          </HeaderTwo>
          <Explanation>
            <GoyemonText fontSize={12}>
              *you can speed up your transaction by changing the limit
            </GoyemonText>
          </Explanation>
          <Slider
            value={minimumGasPrice}
            minimumValue={minimumGasPrice}
            maximumValue={this.state.maxPrice}
            onValueChange={(gasPriceWeiDecimal) => {
              this.updateWeiAmountValidation(
                TransactionUtilities.validateWeiAmountForTransactionFee(
                  gasPriceWeiDecimal,
                  this.props.gasLimit
                )
              );
              this.sliderValueChange(gasPriceWeiDecimal);
            }}
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
          <InsufficientWeiBalanceMessage
            weiAmountValidation={this.state.weiAmountValidation}
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

const TransactionDetailModal = connect(
  mapAddressAndIsOnlineAndModalStateToProps,
  mapDispatchToProps
)(
  class TransactionDetailModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        txToUpdate: props.txToUpdate,
        newGasPrice: null,
        txResent: false,
        loading: false,
        modalHeigh: '60%',
        weiAmountValidation: undefined
      };
      this.uniqcounter = 0;
      this.updateTxState = this.updateTxState.bind(this)
    }

    updateWeiAmountValidationInModal(weiAmountValidation) {
      this.setState({weiAmountValidation})
    }

    handleViewRef = (ref) => (this.view = ref);

    componentDidMount() {
      this.unsub = TxStorage.storage.subscribe(this.updateTxListState.bind(this));
      (async () => {
        this.updateTxListState();
      })();
      if (window.height < 896) {
        this.setState({modalHeigh: '80%'})
      }
    }

    updateTxListState() {
      LogUtilities.toDebugScreen('TransactionDetailModal updateTxListState() called');
      // this.refreshIndices = {0: true,1: true,2: true,3: true,4: true,5: true,6:true,7:true,8:true,9:true};

      this.setState({
        transactions_update_counter: this.uniqcounter++,
        transactionsLoaded: true
      });
    }

    updateTxState(x) {
      this.setState({
        txToUpdate: x
      })
    }

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
      this.setState({ loading: true });
      // update gas
      const newTx = this.state.txToUpdate.deepClone();
      newTx.setGasPrice(this.state.newGasPrice.toString(16));

      if (await TxStorage.storage.updateTx(newTx)) {
        await TransactionUtilities.sendTransactionToServer(newTx);

        this.setState({ txResent: true });
      }
    }

    priceSliderSettled(value) {
      LogUtilities.dumpObject('priceSliderSettled() value', Math.floor(value));
      this.setState({
        newGasPrice: Math.floor(value)
      });
    }

    zoomIn() {
      this.view.zoomIn(1500).then((endState) => {
        this.props.saveTxDetailModalVisibility(false);
        console.log(endState.finished ? 'zoomIn finished' : 'zoomIn cancelled');
        this.setState({ txResent: false });
      });
    }

    render() {
      if (this.state.txToUpdate != null) {
        return (
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={this.props.modal.txDetailModalVisibility}
            onBackdropPress={() => {
              this.props.saveTxDetailModalVisibility(false);
              this.props.onClose();
            }}
            onSwipeComplete={() => {
              this.props.saveTxDetailModalVisibility(false);
              this.props.onClose();
            }}
            style={{
              marginLeft: 4,
              marginRight: 4,
              marginBottom: 0,
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            <ModalContainer style={{height: this.state.modalHeigh}}>
              <ModalHandlerContainer>
                <ModalHandler />
              </ModalHandlerContainer>
              <ScrollView>
              <TouchableOpacity activeOpacity={1}>
                  <TransactionDetail tx={this.state.txToUpdate}
                                     updateTx={this.updateTxState}
                                     updateCounter={this.state.transactions_update_counter}
                                     index={this.props.txIndex}
                                     filter={this.props.txFilter}/>
              </TouchableOpacity>
              {this.props.checksumAddress ===
                Web3.utils.toChecksumAddress(this.state.txToUpdate.getFrom()) &&
              (this.state.txToUpdate.getState() === 0 ||
                this.state.txToUpdate.getState() === 1) ? (
                <>
                  <MagicalGasPriceSlider
                    currentGasPrice={parseInt(
                      this.state.txToUpdate.getGasPrice(),
                      16
                    )}
                    gasLimit={parseInt(this.state.txToUpdate.getGasLimit(), 16)}
                    onSettle={this.priceSliderSettled.bind(this)}
                    updateWeiAmountValidationInModal={this.updateWeiAmountValidationInModal.bind(this)}
                  />
                  <Button
                    text="Speed Up Transaction"
                    textColor="#00A3E2"
                    backgroundColor="#FFF"
                    borderColor="#00A3E2"
                    margin="16px auto"
                    marginBottom="8px"
                    disabled={
                      !this.props.isOnline || this.state.loading || !this.state.weiAmountValidation
                    }
                    opacity={!this.props.isOnline || this.state.loading || !this.state.weiAmountValidation ? 0.5 : 1}
                    onPress={async () => {
                      await this.resendTx();
                      this.zoomIn();
                      this.setState({ loading: false });
                    }}
                  />
                  <AnimationContainer>
                    <CopyAnimation
                      animation={this.state.txResent ? 'zoomIn' : null}
                      ref={this.handleViewRef}
                    >
                      {this.state.txResent ? (
                        <>
                          <GoyemonText fontSize={16}>
                            you sped up your transaction!
                          </GoyemonText>
                          <GoyemonText fontSize={16}>🚀</GoyemonText>
                        </>
                      ) : null}
                    </CopyAnimation>
                  </AnimationContainer>
                  <Loader animating={this.state.loading} size="small" />
                  <IsOnlineMessage isOnline={this.props.isOnline} />
                </>
              ) : null}
              </ScrollView>
            </ModalContainer>
          </Modal>
        );
      }

      return null;
    }
  }
);

const ModalContainer = styled.View`
  background-color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
`;

const ModalHandlerContainer = styled.View`
  background-color: #f8f8f8;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
`;

const AnimationContainer = styled.View`
  align-items: center;
  margin-bottom: 32;
  width: 100%;
`;

const CopyAnimation = Animatable.createAnimatableComponent(styled.Text``);

export default connect(mapChecksumAddressStateToProps)(
  class History extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filter: 'All',
        editedTx: null,
        editedTxIndex: '',
        editedTxFilter: '',
      };
      this.txTapped = this.txTapped.bind(this)
    }

    toggleFilterChoiceText() {
      const choices = ['All', 'Dai'].map((filter) => {
        if (filter === this.state.filter)
          return (
            <View>
              <FilterChoiceTextSelected key={filter}>
                {filter}
              </FilterChoiceTextSelected>
              <HorizontalLine borderColor="#000" />
            </View>
          );

        return (
          <TouchableOpacity
            key={filter}
            onPress={() => this.setState({ filter })}
          >
            <FilterChoiceTextUnselected>{filter}</FilterChoiceTextUnselected>
            <HorizontalLine borderColor="rgba(95, 95, 95, .2)"/>
          </TouchableOpacity>
        );
      });

      return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
    }

    async txTapped(tx, index, filter) {
      LogUtilities.dumpObject('tx', tx);
      await this.setState({ editedTx: tx, editedTxIndex: index, editedTxFilter: filter });
    }

    txClear() {
      this.setState({ editedTx: null, editedTxIndex: '', editedTxFilter: '' });
    }

    render() {
      return (
        <HistoryContainer>
          <TransactionDetailModal
            txToUpdate={this.state.editedTx}
            txIndex={this.state.editedTxIndex}
            txFilter={this.state.editedTxFilter}
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
  margin-right: 16;
`;

const FilterChoiceTextSelected = styled.Text`
  color: #000;
  font-size: 24;
  font-weight: bold;
  margin: 0 8px;
`;

const FilterChoiceTextUnselected = styled.Text`
  font-size: 24;
  font-weight: bold;
  margin: 0 8px;
  opacity: 0.4;
`;
