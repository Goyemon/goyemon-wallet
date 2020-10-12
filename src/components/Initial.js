"use strict";
import BigNumber from "bignumber.js";
import LottieView from "lottie-react-native";
import React, { Component } from "react";
import * as Animatable from "react-native-animatable";
import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { saveCompoundDaiBalance } from "../actions/ActionBalance";
import { saveCompoundDaiInfo } from "../actions/ActionCompound";
import { getGasPrice } from "../actions/ActionGasPrice";
import { getETHPrice, getDAIPrice, getCDAIPrice } from "../actions/ActionPrice";
import { Container } from "./common";
import FcmPermissions from "../firebase/FcmPermissions";
import { FcmMsgs } from "../lib/fcm";
import PortfolioStack from "../navigators/PortfolioStack";
import LogUtilities from "../utilities/LogUtilities";
import WalletUtilities from "../utilities/WalletUtilities.ts";

class Initial extends Component {
  async componentDidUpdate(prevProps) {
    if (this.props.rehydration != prevProps.rehydration) {
      await this.conditionalNavigation();
    }
  }

  async componentDidMount() {
    await this.props.getETHPrice();
    await this.props.getDAIPrice();
    await this.props.getCDAIPrice();
    await this.props.saveCompoundDaiInfo(this.props.checksumAddress);
    this.props.saveCompoundDaiBalance(
      this.props.balance.cDai,
      this.props.compound.dai.currentExchangeRate
    );
    this.props.getGasPrice();
    FcmMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
    FcmMsgs.requestUniswapV2WETHxDAIReserves(this.props.checksumAddress);

    if (this.props.permissions.notification === false) {
      await FcmPermissions.checkFcmPermissions();
    }
    await this.conditionalNavigation();
  }

  async conditionalNavigation() {
    const mnemonicWords = await WalletUtilities.getMnemonic();
    const { rehydration, permissions } = this.props;

    if (rehydration) {
      let hasMnemonicWordsInKeychain;
      if (!mnemonicWords) {
        hasMnemonicWordsInKeychain = false;
      } else if (mnemonicWords) {
        hasMnemonicWordsInKeychain = true;
      }
      const hasPersistedState = this.hasPersistedState();
      const hasPrivateKeyInKeychain = await WalletUtilities.isPrivateKeySaved();

      let mainPage = "Welcome";

      if (
        !hasMnemonicWordsInKeychain ||
        (hasMnemonicWordsInKeychain &&
          permissions.notification === null &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = "Welcome";
      } else if (
        (hasMnemonicWordsInKeychain &&
          permissions.notification &&
          !hasPersistedState &&
          !hasPrivateKeyInKeychain) ||
        (hasMnemonicWordsInKeychain &&
          permissions.notification &&
          !hasPersistedState &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = "WalletCreation";
      } else if (
        hasMnemonicWordsInKeychain &&
        permissions.notification &&
        hasPersistedState &&
        hasPrivateKeyInKeychain
      ) {
        mainPage = "PortfolioHome";
      }

      PortfolioStack.navigationOptions = ({ navigation }) => {
        let tabBarVisible;
        if (navigation.state.index >= 0 && mainPage === "PortfolioHome") {
          tabBarVisible = true;
        } else if (
          (navigation.state.index >= 0 && mainPage === "Welcome") ||
          (navigation.state.index >= 0 && mainPage === "WalletCreation")
        ) {
          tabBarVisible = false;
        }

        return {
          tabBarVisible
        };
      };

      if (
        mainPage === "Welcome" ||
        mainPage === "WalletCreation" ||
        mainPage === "PortfolioHome"
      ) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: mainPage })]
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        console.log("no matches");
      }
    } else if (!rehydration) {
      LogUtilities.logInfo("rehydration is not done yet");
    }
  }

  hasPersistedState() {
    return (
      this.hasTransactions() &&
      this.hasBalance() &&
      this.hasChecksumAddress() &&
      this.hasPrice()
    );
  }

  hasTransactions() {
    return this.props.transactionsLoaded != null;
  }

  hasBalance = () => {
    const { balance } = this.props;
    return (
      new BigNumber(balance.cDai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.dai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.wei).isGreaterThanOrEqualTo(0)
    );
  };

  hasChecksumAddress = () => this.props.checksumAddress != null;

  hasPrice = () => {
    const { price } = this.props;
    return (
      price.eth >= 0 &&
      price.eth.length != 0 &&
      price.dai >= 0 &&
      price.dai.length != 0
    );
  };

  render() {
    return (
      <Container
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        marginTop={0}
        width="90%"
      >
        <LoaderContainer animation="fadeIn" delay={1000}>
          <LottieView
            autoPlay
            loop
            source={require("../../assets/loader_animation.json")}
            style={{
              width: 120,
              height: 120
            }}
          />
        </LoaderContainer>
      </Container>
    );
  }
}

const LoaderContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
`);

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    compound: state.ReducerCompound.compound,
    permissions: state.ReducerPermissions.permissions,
    price: state.ReducerPrice.price,
    rehydration: state.ReducerRehydration.rehydration,
    transactionsLoaded: state.ReducerTransactionsLoaded.transactionsLoaded
  };
}

const mapDispatchToProps = {
  getCDAIPrice,
  getETHPrice,
  getDAIPrice,
  getGasPrice,
  saveCompoundDaiInfo,
  saveCompoundDaiBalance
};

export default connect(mapStateToProps, mapDispatchToProps)(Initial);
