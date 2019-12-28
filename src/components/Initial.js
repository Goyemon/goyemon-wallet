'use strict';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import { RootContainer } from '../components/common';
import HomeStack from '../navigators/HomeStack';
import { store } from '../store/store.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

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
    const transactionCount = stateTree.ReducerTransactionCount.transactionCount;
    return (
      transactions != null &&
      transactions.length != null &&
      transactions.length.toString() === transactionCount.toString()
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

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 40;
  margin-bottom: 16px;
  text-align: center;
`);
