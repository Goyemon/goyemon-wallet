"use strict";
import BigNumber from "bignumber.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ScrollView, RefreshControl } from "react-native";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StackActions, NavigationActions } from "react-navigation";
import styled from "styled-components/native";
import { createChecksumAddress } from "../../../actions/ActionChecksumAddress";
import { saveCompoundDaiInfo } from "../../../actions/ActionCompound";
import { getGasPrice } from "../../../actions/ActionGasPrice";
import {
  getETHPrice,
  getDAIPrice,
  getCDAIPrice
} from "../../../actions/ActionPrice";
import { Container } from "../../common";
import I18n from "../../../i18n/I18n";
import { FcmMsgs } from "../../../lib/fcm";
import { storage } from "../../../lib/tx";
import PortfolioStack from "../../../navigators/PortfolioStack";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";

class WalletCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      modalVisible: false,
      isWalletReady: false
    };
  }

  FadeInMessages() {
    return (
      <FadeInMessageContainer>
        {[
          I18n.t("wallet-creation-key"),
          I18n.t("wallet-creation-address"),
          I18n.t("wallet-creation-blockchain-data"),
          I18n.t("wallet-creation-price-data"),
          I18n.t("wallet-creation-caution")
        ].map((text, i) => (
          <FadeInMessage
            animation="fadeInDown"
            delay={2500 + (i - 1) * 1500}
            key={i}
            top={12 + i}
          >
            <FadeInMessageText>{text}...</FadeInMessageText>
          </FadeInMessage>
        ))}
      </FadeInMessageContainer>
    );
  }

  PullDownToRefreshMessage() {
    return (
      <FadeInMessageSix animation="fadeIn" delay={11500}>
        <FadeInMessageSixText>pull down to refresh 👇</FadeInMessageSixText>
      </FadeInMessageSix>
    );
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        await this.createWallet();
        await this.isWalletReady();
        this.setState({
          refreshing: false
        });
      }
    );
  };

  async componentDidMount() {
    await this.createWallet();
    setTimeout(async () => {
      await this.isWalletReady();
    }, 8000);

    await this.props.getETHPrice();
    await this.props.getDAIPrice();
    await this.props.getCDAIPrice();
    this.props.getGasPrice();
    await this.props.saveCompoundDaiInfo(this.props.checksumAddress);
    FcmMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
    FcmMsgs.requestUniswapV2WETHxDAIReserves(this.props.checksumAddress);
  }

  async createWallet() {
    const mnemonicWords = await WalletUtilities.getMnemonic();
    await WalletUtilities.generateWallet(mnemonicWords);
    await WalletUtilities.setPrivateKey(
      await WalletUtilities.createPrivateKey()
    );
    await this.props.createChecksumAddress();
    storage.setOwnAddress(this.props.checksumAddress);
    FcmMsgs.registerEthereumAddress(this.props.checksumAddress);
  }

  async isWalletReady() {
    const isWalletReady = await this.hasWallet();
    this.setState({ isWalletReady });
  }

  async hasWallet() {
    return (
      this.hasMnemonicWords() &&
      (await this.hasPrivateKey()) &&
      this.hasTransactions() &&
      this.hasBalance() &&
      this.hasChecksumAddress()
    );
  }

  async hasMnemonicWords() {
    const mnemonicWords = await WalletUtilities.getMnemonic();
    return mnemonicWords != null;
  }

  async hasPrivateKey() {
    return await WalletUtilities.isPrivateKeySaved();
  }

  hasTransactions() {
    return this.props.transactionsLoaded != null;
  }

  hasBalance() {
    const { balance } = this.props;

    return (
      new BigNumber(balance.cDai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.dai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.wei).isGreaterThanOrEqualTo(0)
    );
  }

  hasChecksumAddress() {
    return this.props.checksumAddress != null;
  }

  navigateToPortfolioHome() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return tabBarVisible;
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "PortfolioHome" })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    if (this.state.isWalletReady === true) {
      if (!this.state.modalVisible) {
        this.setState({ modalVisible: true }, () => {
          setTimeout(() => {
            this.navigateToPortfolioHome();
          }, 2000);
        });
      }
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            tintColor="#FDC800"
          />
        }
      >
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="90%"
        >
          {this.PullDownToRefreshMessage()}
          {this.FadeInMessages()}
          <Modal
            animationIn="fadeIn"
            animationInTiming={800}
            isVisible={this.state.modalVisible}
          >
            <ModalInner>
              <ModalText>Your wallet is ready! 🙌</ModalText>
            </ModalInner>
          </Modal>
        </Container>
      </ScrollView>
    );
  }
}

const FadeInMessageContainer = styled.View`
  min-height: ${hp("50%")};
`;

const FadeInMessage = Animatable.createAnimatableComponent(styled.View`
  top: ${(props) => hp(`${props.top}%`)};
`);

const FadeInMessageText = styled.Text`
  color: #5f5f5f;
  font-family: "HKGrotesk-Regular";
  font-size: 24;
`;

const FadeInMessageSix = Animatable.createAnimatableComponent(styled.View`
  top: ${hp("6%")};
`);

const FadeInMessageSixText = styled.Text`
  color: #000;
  font-family: "HKGrotesk-Regular";
  font-size: 24;
`;

const ModalInner = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const ModalText = styled.Text`
  color: #fff;
  font-family: "HKGrotesk-Bold";
  font-size: 24;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    transactionsLoaded: state.ReducerTransactionsLoaded.transactionsLoaded
  };
}

const mapDispatchToProps = {
  createChecksumAddress,
  getCDAIPrice,
  getETHPrice,
  getDAIPrice,
  getGasPrice,
  saveCompoundDaiInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletCreation);
