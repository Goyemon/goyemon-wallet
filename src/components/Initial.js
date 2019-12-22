'use strict';
import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { RootContainer } from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import HomeStack from '../navigators/HomeStack';
import firebase from 'react-native-firebase';
import { store } from '../store/store.js';

export default class Initial extends Component {
  async componentDidMount() {
    let mnemonicWordsStatePersisted;
    const stateTree = store.getState();
    const mnemonicWords = stateTree.ReducerMnemonic.mnemonicWords;
    if (mnemonicWords === null) {
      mnemonicWordsStatePersisted = false;
    } else if (mnemonicWords != null) {
      mnemonicWordsStatePersisted = true;
    }

    const hasPersistedState = this.hasPersistedState();

    const hasPrivateKeyInKeychain = await WalletUtilities.privateKeySaved();

    let notificationEnabled = stateTree.ReducerNotificationPermission.notificationPermission;
    const enabled = await firebase.messaging().hasPermission();
    if (enabled === true) {
      notificationEnabled = true;
    }

    let mainPage = 'Welcome';

    if (!mnemonicWordsStatePersisted && !notificationEnabled && !hasPrivateKeyInKeychain) {
      mainPage = 'Welcome';
    } else if (mnemonicWordsStatePersisted && !notificationEnabled && !hasPrivateKeyInKeychain) {
      mainPage = 'Welcome';
    } else if (
      mnemonicWordsStatePersisted &&
      notificationEnabled &&
      !hasPersistedState &&
      !hasPrivateKeyInKeychain
    ) {
      mainPage = 'WalletCreation';
    } else if (
      mnemonicWordsStatePersisted &&
      notificationEnabled &&
      !hasPersistedState &&
      hasPrivateKeyInKeychain
    ) {
      mainPage = 'WalletCreation';
    } else if (
      mnemonicWordsStatePersisted &&
      notificationEnabled &&
      hasPersistedState &&
      hasPrivateKeyInKeychain
    ) {
      mainPage = 'WalletList';
    } else if (
      mnemonicWordsStatePersisted &&
      notificationEnabled === null &&
      hasPrivateKeyInKeychain
    ) {
      mainPage = 'Welcome';
    } else if (mnemonicWordsStatePersisted && !notificationEnabled && hasPrivateKeyInKeychain) {
      mainPage = 'NotificationPermissionNotGranted';
    } else if (!mnemonicWordsStatePersisted && notificationEnabled && !hasPrivateKeyInKeychain) {
      mainPage = 'Welcome';
    } else if (!mnemonicWordsStatePersisted && !notificationEnabled && hasPrivateKeyInKeychain) {
      mainPage = 'Welcome';
    }

    HomeStack.navigationOptions = ({ navigation }) => {
      let tabBarVisible;
      if (navigation.state.index >= 0 && mainPage === 'WalletList') {
        tabBarVisible = true;
      } else if (
        (navigation.state.index >= 0 && mainPage === 'Welcome') ||
        'NotificationPermissionNotGranted' ||
        'WalletCreation'
      ) {
        tabBarVisible = false;
      }

      return {
        tabBarVisible
      };
    };

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: mainPage })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  hasPersistedState() {
    return (
      this.hasTransactionHistory() &&
      this.hasBalance() &&
      this.hasChecksumAddress() &&
      this.hasPrice()
    );
  }

  hasTransactionHistory() {
    const stateTree = store.getState();
    const transactions = stateTree.ReducerTransactionHistory.transactions;
    const transactionCount = stateTree.ReducerTransactionHistory.transactionCount;
    return (
      transactions != null &&
      transactions.length != null &&
      transactions.length.toString() === transactionCount
    );
  }

  hasBalance() {
    const stateTree = store.getState();
    const balance = stateTree.ReducerBalance.balance;
    return (
      balance.ethBalance >= 0 &&
      balance.ethBalance.length != 0 &&
      balance.daiBalance >= 0 &&
      balance.daiBalance.length != 0
    );
  }

  hasChecksumAddress() {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    return checksumAddress != null;
  }

  hasPrice() {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;
    return (
      price.ethPrice >= 0 &&
      price.ethPrice.length != 0 &&
      price.daiPrice >= 0 &&
      price.daiPrice.length != 0
    );
  }

  render() {
    return (
      <RootContainer>
        <Container>
          <Logo animation="fadeIn">Crypterest</Logo>
          <Title animation="fadeIn" delay={2000}>
            loading
          </Title>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 240px;
  text-align: center;
`;

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Bold';
  font-size: 40px;
  margin-bottom: 48px;
  text-align: center;
  text-transform: uppercase;
`);

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 40px;
  margin-bottom: 16px;
  text-align: center;
`);
