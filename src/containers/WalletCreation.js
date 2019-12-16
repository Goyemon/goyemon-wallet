'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, Loader, HeaderTwo, Description } from '../components/common';
import { View, Image, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { StackActions, NavigationActions } from 'react-navigation';
import HomeStack from '../navigators/HomeStack';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import FirebaseRegister from '../firebase/FirebaseRegister.ts';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';

class WalletCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      hasPrivateKeyInKeychain: false
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
    await FirebaseRegister.registerEthereumAddress(this.props.checksumAddress);
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
    return (
      this.props.transactions != null &&
      this.props.transactions.length != null &&
      this.props.transactions.length.toString() === this.props.transactionCount
    );
  }

  hasBalance() {
    return (
      this.props.balance.ethBalance >= 0 &&
      this.props.balance.ethBalance.length != 0 &&
      this.props.balance.daiBalance >= 0 &&
      this.props.balance.daiBalance.length != 0
    );
  }

  hasChecksumAddress() {
    return this.props.checksumAddress != null;
  }

  hasPrice() {
    return (
      this.props.price.ethPrice >= 0 &&
      this.props.price.ethPrice.length != 0 &&
      this.props.price.daiPrice >= 0 &&
      this.props.price.daiPrice.length != 0
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
      this.navigateToWalletList();
      return <View />;
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
        </Container>
      </ScrollView>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-top: 120px;
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
