"use strict";
import React, { Component } from "react";
import { TouchableOpacity, ScrollView, View, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import styled from "styled-components";
import Web3 from "web3";
import EtherUtilities from "../../utilities/EtherUtilities";
import TransactionDetailContainer from "./TransactionDetailContainer";
import { saveTxDetailModalVisibility } from "../../actions/ActionModal";
import {
  Container,
  HeaderOne,
  Button,
  GoyemonText,
  IsOnlineMessage,
  ModalHandler,
  HorizontalLine,
  Loader
} from "../common";

// TODO: git rm those two:
//import Transactions from '../containers/Transactions';
//import TransactionsDai from '../containers/TransactionsDai';
import OfflineNotice from "../../components/OfflineNotice";
import TransactionList from "./TransactionList";
import I18n from "../../i18n/I18n";
import { storage } from "../../lib/tx";
import LogUtilities from "../../utilities/LogUtilities";
import TransactionUtilities from "../../utilities/TransactionUtilities";
import MagicalGasPriceSlider from "./SpeedupModal";

const window = Dimensions.get("window");

const mapChecksumAddressStateToProps = (state) => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress
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
        tx: props.tx,
        data: TransactionUtilities.txDetailObject(
          props.tx,
          EtherUtilities.getAddressWithout0x(props.checksumAddress)
        )
      };
    }

    componentDidMount() {
      LogUtilities.toDebugScreen(
        "TransactionDetail Tx",
        this.state.tx.tokenData
      );
      LogUtilities.toDebugScreen("TransactionDetail Tx", this.state.txData);
    }

    async componentDidUpdate(prevProps) {
      if (this.props.updateCounter !== prevProps.updateCounter) {
        storage
          .getTx(this.props.index, this.props.filter)
          .then(async (x) => {
            await this.setState({
              data: TransactionUtilities.txDetailObject(
                x,
                EtherUtilities.getAddressWithout0x(this.props.checksumAddress)
              ),
              tx: x
            });
          })
          .catch((e) =>
            LogUtilities.toDebugScreen("TransactionDetail Tx Error With", e)
          );
      }
      await this.props.updateTx(this.state.tx);
    }

    render() {
      return !this.state.tx ? (
        <GoyemonText fontSize={12}>nothink!</GoyemonText>
      ) : (
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="flex-start"
          marginTop={0}
          width="100%"
        >
          <TransactionDetailContainer data={this.state.data} />
        </Container>
      );
    }
  }
);

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
        modalHeight: "50%",
        WEIAmountValidation: undefined
      };
      this.uniqcounter = 0;
      this.updateTxState = this.updateTxState.bind(this);
    }

    updateWeiAmountValidationInModal(WEIAmountValidation) {
      this.setState({ WEIAmountValidation });
    }

    handleViewRef = (ref) => (this.view = ref);

    componentDidMount() {
      this.unsub = storage.subscribe(this.updateTxListState.bind(this));
      (async () => {
        this.updateTxListState();
      })();
      if (window.height < 896) {
        this.setState({ modalHeight: "80%" });
      }
    }

    updateTxListState() {
      LogUtilities.toDebugScreen(
        "TransactionDetailModal updateTxListState() called"
      );
      // this.refreshIndices = {0: true,1: true,2: true,3: true,4: true,5: true,6:true,7:true,8:true,9:true};

      this.setState({
        transactions_update_counter: this.uniqcounter++,
        transactionsLoaded: true
      });
    }

    updateTxState(x) {
      this.setState({
        txToUpdate: x
      });
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

      if (await storage.updateTx(newTx)) {
        await TransactionUtilities.sendTransactionToServer(newTx);

        this.setState({ txResent: true });
      }
    }

    priceSliderSettled(value) {
      LogUtilities.dumpObject("priceSliderSettled() value", Math.floor(value));
      this.setState({
        newGasPrice: Math.floor(value)
      });
    }

    zoomIn() {
      this.view.zoomIn(1500).then((endState) => {
        this.props.saveTxDetailModalVisibility(false);
        console.log(endState.finished ? "zoomIn finished" : "zoomIn cancelled");
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
              flexDirection: "row",
              alignItems: "flex-end"
            }}
          >
            <ModalContainer style={{ height: this.state.modalHeight }}>
              <ModalHandlerContainer>
                <ModalHandler />
              </ModalHandlerContainer>
              <ScrollView>
                <TouchableOpacity activeOpacity={1}>
                  <TransactionDetail
                    tx={this.state.txToUpdate}
                    updateTx={this.updateTxState}
                    updateCounter={this.state.transactions_update_counter}
                    index={this.props.txIndex}
                    filter={this.props.txFilter}
                  />
                </TouchableOpacity>
                {this.props.checksumAddress ===
                  Web3.utils.toChecksumAddress(
                    this.state.txToUpdate.getFrom()
                  ) &&
                (this.state.txToUpdate.getState() === 0 ||
                  this.state.txToUpdate.getState() === 1) ? (
                  <>
                    <MagicalGasPriceSlider
                      currentGasPrice={parseInt(
                        this.state.txToUpdate.getGasPrice(),
                        16
                      )}
                      gasLimit={parseInt(
                        this.state.txToUpdate.getGasLimit(),
                        16
                      )}
                      onSettle={this.priceSliderSettled.bind(this)}
                      updateWeiAmountValidationInModal={this.updateWeiAmountValidationInModal.bind(
                        this
                      )}
                    />
                    <Button
                      text="Speed Up Transaction"
                      textColor="#00A3E2"
                      backgroundColor="#FFF"
                      borderColor="#00A3E2"
                      margin="16px auto"
                      marginBottom="8px"
                      disabled={
                        !this.props.isOnline ||
                        this.state.loading ||
                        !this.state.WEIAmountValidation
                      }
                      opacity={
                        !this.props.isOnline ||
                        this.state.loading ||
                        !this.state.WEIAmountValidation
                          ? 0.5
                          : 1
                      }
                      onPress={async () => {
                        await this.resendTx();
                        this.zoomIn();
                        this.setState({ loading: false });
                      }}
                    />
                    <AnimationContainer>
                      <CopyAnimation
                        animation={this.state.txResent ? "zoomIn" : null}
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
        filter: "All",
        editedTx: null,
        editedTxIndex: "",
        editedTxFilter: ""
      };
      this.txTapped = this.txTapped.bind(this);
    }

    toggleFilterChoiceText() {
      const choices = ["All"].map((filter) => {
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
            <HorizontalLine borderColor="rgba(95, 95, 95, .2)" />
          </TouchableOpacity>
        );
      });

      return <FilterChoiceContainer>{choices}</FilterChoiceContainer>;
    }

    async txTapped(tx, index, filter) {
      LogUtilities.dumpObject("tx", tx);
      await this.setState({
        editedTx: tx,
        editedTxIndex: index,
        editedTxFilter: filter
      });
    }

    txClear() {
      this.setState({ editedTx: null, editedTxIndex: "", editedTxFilter: "" });
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
          <HeaderOne marginTop="64">{I18n.t("history")}</HeaderOne>
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
