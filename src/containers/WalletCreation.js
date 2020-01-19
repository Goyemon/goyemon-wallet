'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, ScrollView, RefreshControl, Modal } from 'react-native';
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
      hasPrivateKeyInKeychain: false,
      modalVisible: false
    };
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        await this.createWallet();
        this.setState({
          refreshing: false
        });
      }
    );
  };

  async componentDidMount() {
    await this.createWallet();
  }

  async createWallet() {
    await WalletUtilities.generateWallet(this.props.mnemonicWords);
    await this.savePrivateKey();
    const privateKeyInKeychain = await WalletUtilities.privateKeySaved();
    this.setState({ hasPrivateKeyInKeychain: privateKeyInKeychain });
    await this.props.createChecksumAddress();
    await FcmUpstreamMsgs.registerEthereumAddress(this.props.checksumAddress);
    await this.props.getEthPrice();
    await this.props.getDaiPrice();
  }

  async savePrivateKey() {
    const privateKey = await WalletUtilities.createPrivateKey();
    await WalletUtilities.setPrivateKey(privateKey);
  }

  hasPersistedState() {
    return (
      this.hasMnemonicWords() &&
      this.hasTransactionHistory() &&
      this.hasBalance() &&
      this.hasChecksumAddress() &&
      this.hasPrice()
    );
  }

  hasMnemonicWords() {
    return this.props.mnemonicWords != null;
  }

  hasTransactionHistory() {
    if (this.props.transactionCount != null && this.props.transactions != null) {
      return (
        this.props.transactions != null &&
        this.props.transactions.length != null &&
        this.props.transactions.length.toString() === this.props.transactionCount.toString()
      );
    } else if (this.props.transactionCount === null) {
      return false;
    }
  }

  hasBalance() {
    return (
      this.props.balance.ethBalance >= 0 &&
      this.props.balance.ethBalance.length != 0 &&
      this.props.balance.cDaiBalance >= 0 &&
      this.props.balance.cDaiBalance.length != 0 &&
      this.props.balance.daiBalance >= 0 &&
      this.props.balance.daiBalance.length != 0
    );
  }

  hasChecksumAddress() {
    return this.props.checksumAddress != null;
  }

  hasPrice() {
    return (
      this.props.price.eth >= 0 &&
      this.props.price.eth.length != 0 &&
      this.props.price.dai >= 0 &&
      this.props.price.dai.length != 0
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
    if (this.state.hasPrivateKeyInKeychain && this.hasPersistedState()) {
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
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="40">
            Setting up your wallet...
          </HeaderTwo>
          <Description marginBottom="24" marginLeft="8" marginTop="16">
            this shouldn't take long
          </Description>
          <CreatingWalletImage source={require('../../assets/creating_wallet.png')} />
          <Modal animationType="fade" transparent visible={this.state.modalVisible}>
            <ModalBackground>
              <ModalInner>
                <ModalText>Your wallet is created!</ModalText>
              </ModalInner>
              <Button
                text="Go!"
                textColor="#00A3E2"
                backgroundColor="#FFF"
                borderColor="#00A3E2"
                margin="120px auto"
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

const ModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
`;

const ModalInner = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const ModalText = styled.Text`
  background-color: #fff;
  margin-top: 70%;
  padding: 8px 24px;
  text-align: center;
`;

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 120;
`;

const CreatingWalletImage = styled.Image`
  height: 320px;
  width: 320px;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    transactionCount: state.ReducerTransactionCount.transactionCount,
    transactions: state.ReducerTransactionHistory.transactions,
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
