'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl, Modal, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import { HeaderTwo, Description, Button } from '../components/common';
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import HomeStack from '../navigators/HomeStack';
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
        <FadeInMessageOne animation="fadeInDown" delay={1000}>
          <FadeInMessageOneText>generating your keys...</FadeInMessageOneText>
        </FadeInMessageOne>
        <FadeInMessageTwo animation="fadeInDown" delay={2500}>
          <FadeInMessageTwoText>generating your address...</FadeInMessageTwoText>
        </FadeInMessageTwo>
        <FadeInMessageThree animation="fadeInDown" delay={4000}>
          <FadeInMessageThreeText>fetching blockchain data...</FadeInMessageThreeText>
        </FadeInMessageThree>
        <FadeInMessageFour animation="fadeInDown" delay={5500}>
          <FadeInMessageFourText>getting price data...</FadeInMessageFourText>
        </FadeInMessageFour>
        <FadeInMessageFive animation="fadeInDown" delay={8000}>
          <FadeInMessageFiveText>this shouldn't take too long...</FadeInMessageFiveText>
        </FadeInMessageFive>
      </FadeInMessageContainer>
    );
  }

  PullDownToRefreshMessage() {
    return (
      <FadeInMessageSix animation="fadeIn" delay={10000}>
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
        await this.fetchTokenInfo();
        await this.fetchPriceInfo();
        await this.isWalletReady();
        this.setState({
          refreshing: false
        });
      }
    );
  };

  async componentDidMount() {
    await this.createWallet();
    await this.fetchPriceInfo();
    await this.fetchTokenInfo();
    setTimeout(async () => {
      await this.isWalletReady();
    }, 8000);
  }

  async createWallet() {
    await WalletUtilities.generateWallet(this.props.mnemonicWords);
    await WalletUtilities.setPrivateKey(await WalletUtilities.createPrivateKey());
    await this.props.createChecksumAddress();
    await FcmUpstreamMsgs.registerEthereumAddress(this.props.checksumAddress);
  }

  async fetchPriceInfo() {
    await this.props.getEthPrice();
    await this.props.getDaiPrice();
  }

  fetchTokenInfo() {
    FcmUpstreamMsgs.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  async isWalletReady() {
    const hasWallet = await this.hasWallet();
    const hasTokenInfo = this.hasTokenInfo();
    const hasPriceInfo = this.hasPriceInfo();
    const isWalletReady = hasWallet && hasTokenInfo && hasPriceInfo;
    this.setState({ isWalletReady });
  }

  async hasWallet() {
    return (
      this.hasMnemonicWords() &&
      (await this.hasPrivateKey()) &&
      // this.hasTransactions() &&
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

  hasBalance() {
    const cDaiBalance = new BigNumber(this.props.balance.cDaiBalance);
    const daiBalance = new BigNumber(this.props.balance.daiBalance);
    const weiBalance = new BigNumber(this.props.balance.weiBalance);

    return (
      cDaiBalance.isGreaterThanOrEqualTo(0) &&
      daiBalance.isGreaterThanOrEqualTo(0) &&
      weiBalance.isGreaterThanOrEqualTo(0)
    );
  }

  hasChecksumAddress() {
    return this.props.checksumAddress != null;
  }

  hasPriceInfo() {
    return this.hasPrice();
  }

  hasPrice() {
    return (
      this.props.price.eth >= 0 &&
      this.props.price.eth.length != 0 &&
      this.props.price.dai >= 0 &&
      this.props.price.dai.length != 0
    );
  }

  hasTokenInfo() {
    return this.hasCDaiLendingInfo();
  }

  hasCDaiLendingInfo() {
    return (
      this.props.cDaiLendingInfo.daiApproval != null &&
      this.props.cDaiLendingInfo.currentExchangeRate >= 0 &&
      this.props.cDaiLendingInfo.currentExchangeRate.length != 0 &&
      this.props.cDaiLendingInfo.currentInterestRate >= 0 &&
      this.props.cDaiLendingInfo.currentInterestRate.length != 0 &&
      this.props.cDaiLendingInfo.lifetimeEarned >= 0 &&
      this.props.cDaiLendingInfo.lifetimeEarned.length != 0
    );
  }

  navigateToWalletList() {
    HomeStack.navigationOptions = ({ navigation }) => {
      const tabBarVisible = true;
      return tabBarVisible;
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'WalletList' })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    if (this.state.isWalletReady === true) {
      if (!this.state.modalVisible) {
        this.setState({ modalVisible: true });
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
        <Container>
          {this.PullDownToRefreshMessage()}
          {this.FadeInMessages()}
          <Modal animationType="fade" transparent visible={this.state.modalVisible}>
            <ModalBackground>
              <ModalInner>
                <ModalText>You are all set!</ModalText>
              </ModalInner>
              <Button
                text="High Five! 🙌"
                textColor="#00A3E2"
                backgroundColor="#FFF"
                borderColor="#00A3E2"
                margin="120px auto"
                marginBottom="12px"
                opacity="1"
                onPress={() => {
                  this.navigateToWalletList();
                }}
              />
            </ModalBackground>
          </Modal>
        </Container>
      </ScrollView>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 90%;
`;

const ModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
`;

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
  flex-direction: column;
  justify-content: center;
`;

const ModalText = styled.Text`
  background-color: #fff;
  border-radius: 8;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-top: 70%;
  padding: 8px 24px;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    mnemonicWords: state.ReducerMnemonic.mnemonicWords,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    price: state.ReducerPrice.price
  };
}

const mapDispatchToProps = {
  createChecksumAddress,
  getEthPrice,
  getDaiPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletCreation);
