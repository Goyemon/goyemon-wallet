"use strict";
import BigNumber from "bignumber.js";
import LottieView from "lottie-react-native";
import React, { Component } from "react";
import * as Animatable from "react-native-animatable";
import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { getGasPrice } from "../actions/ActionGasPrice";
import { getETHPrice, getDAIPrice, getCDAIPrice } from "../actions/ActionPrice";
import { Container } from "./common";
import FcmPermissions from "../firebase/FcmPermissions.js";
import { FCMMsgs } from "../lib/fcm.js";
import PortfolioStack from "../navigators/PortfolioStack";
import LogUtilities from "../utilities/LogUtilities.js";
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
    this.props.getGasPrice();
    FCMMsgs.requestCompoundDaiInfo(this.props.checksumAddress);
    FCMMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
    FCMMsgs.requestUniswapV2WETHxDAIReserves(this.props.checksumAddress);

    if (this.props.permissions.notification === false) {
      await FcmPermissions.checkFcmPermissions();
    }
    await this.conditionalNavigation();
  }

  async conditionalNavigation() {
    const {
      rehydration,
      mnemonicWords,
      mnemonicWordsValidation,
      permissions
    } = this.props;

    if (rehydration) {
      let mnemonicWordsStatePersisted;
      if (mnemonicWords === null) {
        mnemonicWordsStatePersisted = false;
      } else if (mnemonicWords != null) {
        mnemonicWordsStatePersisted = true;
      }

      const hasPersistedState = this.hasPersistedState();

      const hasPrivateKeyInKeychain = await WalletUtilities.privateKeySaved();

      let mainPage = "Welcome";

      if (
        !mnemonicWordsStatePersisted ||
        (mnemonicWordsStatePersisted &&
          permissions.notification === null &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = "Welcome";
      } else if (
        mnemonicWordsStatePersisted &&
        !mnemonicWordsValidation &&
        !hasPersistedState &&
        !hasPrivateKeyInKeychain
      ) {
        mainPage = "ShowMnemonic";
      } else if (
        mnemonicWordsStatePersisted &&
        !permissions.notification &&
        hasPrivateKeyInKeychain
      ) {
        mainPage = "NotificationPermissionNotGranted";
      } else if (
        (mnemonicWordsStatePersisted &&
          mnemonicWordsValidation &&
          permissions.notification &&
          !hasPersistedState &&
          !hasPrivateKeyInKeychain) ||
        (mnemonicWordsStatePersisted &&
          permissions.notification &&
          !hasPersistedState &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = "WalletCreation";
      } else if (
        mnemonicWordsStatePersisted &&
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
          (navigation.state.index >= 0 &&
            mainPage === "NotificationPermissionNotGranted") ||
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
        mainPage === "NotificationPermissionNotGranted" ||
        mainPage === "WalletCreation" ||
        mainPage === "PortfolioHome"
      ) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: mainPage })]
        });
        this.props.navigation.dispatch(resetAction);
      } else if (mainPage === "ShowMnemonic") {
        const resetAction = StackActions.reset({
          index: 2,
          actions: [
            NavigationActions.navigate({ routeName: "Welcome" }),
            NavigationActions.navigate({ routeName: "CreateWalletTutorial" }),
            NavigationActions.navigate({ routeName: "ShowMnemonic" })
          ]
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
          <Logo>goyemon</Logo>
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

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #e41b13;
  font-family: "HKGrotesk-Bold";
  font-size: 40;
  text-align: center;
`);

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    mnemonicWords: state.ReducerMnemonic.mnemonicWords,
    mnemonicWordsValidation:
      state.ReducerMnemonicWordsValidation.mnemonicWordsValidation,
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
  getGasPrice
};

export default connect(mapStateToProps, mapDispatchToProps)(Initial);
