'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import { getGasPrice } from '../actions/ActionGasPrice';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import { Container } from '../components/common';
import I18n from '../i18n/I18n';
import { FCMMsgs } from '../lib/fcm.js';
import TxStorage from '../lib/tx';
import PortfolioStack from '../navigators/PortfolioStack';
import WalletUtilities from '../utilities/WalletUtilities.ts';

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
        <FadeInMessageOne animation="fadeInDown" delay={2500}>
          <FadeInMessageOneText>
            {I18n.t('wallet-creation-key')}...
          </FadeInMessageOneText>
        </FadeInMessageOne>
        <FadeInMessageTwo animation="fadeInDown" delay={4000}>
          <FadeInMessageTwoText>
            {I18n.t('wallet-creation-address')}...
          </FadeInMessageTwoText>
        </FadeInMessageTwo>
        <FadeInMessageThree animation="fadeInDown" delay={5500}>
          <FadeInMessageThreeText>
            {I18n.t('wallet-creation-blockchain-data')}...
          </FadeInMessageThreeText>
        </FadeInMessageThree>
        <FadeInMessageFour animation="fadeInDown" delay={7000}>
          <FadeInMessageFourText>
            {I18n.t('wallet-creation-price-data')}...
          </FadeInMessageFourText>
        </FadeInMessageFour>
        <FadeInMessageFive animation="fadeInDown" delay={9500}>
          <FadeInMessageFiveText>
            {I18n.t('wallet-creation-caution')}...
          </FadeInMessageFiveText>
        </FadeInMessageFive>
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

    await this.props.getEthPrice();
    await this.props.getDaiPrice();
    this.props.getGasPrice();
    FCMMsgs.requestCompoundDaiInfo(this.props.checksumAddress);
    FCMMsgs.requestPoolTogetherDaiInfo(this.props.checksumAddress);
    FCMMsgs.requestUniswapV2WETHxDAIReserves(this.props.checksumAddress);
  }

  async createWallet() {
    await WalletUtilities.generateWallet(this.props.mnemonicWords);
    await WalletUtilities.setPrivateKey(
      await WalletUtilities.createPrivateKey()
    );
    await this.props.createChecksumAddress();
    TxStorage.storage.setOwnAddress(this.props.checksumAddress);
    FCMMsgs.registerEthereumAddress(this.props.checksumAddress);
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

  hasMnemonicWords() {
    return this.props.mnemonicWords != null;
  }

  async hasPrivateKey() {
    return await WalletUtilities.privateKeySaved();
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
    PortfolioStack.navigationOptions = ({ navigation }) => {
      const tabBarVisible = true;
      return tabBarVisible;
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'PortfolioHome' })]
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
  min-height: ${hp('50%')};
`;

const FadeInMessageOne = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('12%')};
`);

const FadeInMessageOneText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const FadeInMessageTwo = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('13%')};
`);

const FadeInMessageTwoText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const FadeInMessageThree = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('14%')};
`);

const FadeInMessageThreeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const FadeInMessageFour = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('15%')};
`);

const FadeInMessageFourText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const FadeInMessageFive = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('16%')};
`);

const FadeInMessageFiveText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const FadeInMessageSix = Animatable.createAnimatableComponent(styled.View`
  top: ${hp('6%')};
`);

const FadeInMessageSixText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
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
  font-family: 'HKGrotesk-Bold';
  font-size: 24;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    mnemonicWords: state.ReducerMnemonic.mnemonicWords,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    transactionsLoaded: state.ReducerTransactionsLoaded.transactionsLoaded
  };
}

const mapDispatchToProps = {
  createChecksumAddress,
  getEthPrice,
  getDaiPrice,
  getGasPrice
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletCreation);
