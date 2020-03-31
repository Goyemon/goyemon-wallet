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
import { getGasPrice } from '../actions/ActionGasPrice';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import { Container, Button } from '../components/common';
import { FCMMsgs } from '../lib/fcm.js';
import TxStorage from '../lib/tx';
import BalanceStack from '../navigators/BalanceStack';
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
          <FadeInMessageOneText>generating your keys...</FadeInMessageOneText>
        </FadeInMessageOne>
        <FadeInMessageTwo animation="fadeInDown" delay={4000}>
          <FadeInMessageTwoText>
            generating your address...
          </FadeInMessageTwoText>
        </FadeInMessageTwo>
        <FadeInMessageThree animation="fadeInDown" delay={5500}>
          <FadeInMessageThreeText>
            fetching blockchain data...
          </FadeInMessageThreeText>
        </FadeInMessageThree>
        <FadeInMessageFour animation="fadeInDown" delay={7000}>
          <FadeInMessageFourText>getting price data...</FadeInMessageFourText>
        </FadeInMessageFour>
        <FadeInMessageFive animation="fadeInDown" delay={9500}>
          <FadeInMessageFiveText>
            this shouldn't take too long...
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
    this.props.getGasPrice();
    await this.createWallet();
    await this.fetchPriceInfo();
    await this.fetchTokenInfo();
    setTimeout(async () => {
      await this.isWalletReady();
    }, 8000);
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

  async fetchPriceInfo() {
    await this.props.getEthPrice();
    await this.props.getDaiPrice();
  }

  fetchTokenInfo() {
    FCMMsgs.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  async isWalletReady() {
    const hasWallet = await this.hasWallet();
    const hasPriceInfo = this.hasPriceInfo();
    const isWalletReady = hasWallet && hasPriceInfo;
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

  navigateToBalanceHome() {
    BalanceStack.navigationOptions = ({ navigation }) => {
      const tabBarVisible = true;
      return tabBarVisible;
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'BalanceHome' })]
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
            animationType="fade"
            transparent
            visible={this.state.modalVisible}
          >
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
                  this.navigateToBalanceHome();
                }}
              />
            </ModalBackground>
          </Modal>
        </Container>
      </ScrollView>
    );
  }
}

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
    price: state.ReducerPrice.price,
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
