'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import HomeStack from '../navigators/HomeStack';
import { store } from '../store/store.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

import TxStorage from '../lib/tx.js';

export default class Initial extends Component {
  stateTree = store.getState();
  balance = this.stateTree.ReducerBalance.balance;
  checksumAddress = this.stateTree.ReducerChecksumAddress.checksumAddress;
  mnemonicWords = this.stateTree.ReducerMnemonic.mnemonicWords;
  mnemonicWordsValidation = this.stateTree.ReducerMnemonicWordsValidation.mnemonicWordsValidation;
  notificationEnabled = this.stateTree.ReducerPermissions.permissions.notification;
  price = this.stateTree.ReducerPrice.price;
  transactionsLoaded = this.stateTree.ReducerTransactionsLoaded.transactionsLoaded;

  async componentDidMount() {
    TxStorage.storage.setOwnAddress(this.checksumAddress); 

    let mnemonicWordsStatePersisted;
    if (this.mnemonicWords === null) {
      mnemonicWordsStatePersisted = false;
    } else if (this.mnemonicWords != null) {
      mnemonicWordsStatePersisted = true;
    }

    const hasPersistedState = this.hasPersistedState();

    const hasPrivateKeyInKeychain = await WalletUtilities.privateKeySaved();

    const enabled = await firebase.messaging().hasPermission();
    if (enabled === true) {
      this.notificationEnabled = true;
    }

    let mainPage = 'Welcome';

    if (
      (!mnemonicWordsStatePersisted && !this.notificationEnabled && !hasPrivateKeyInKeychain) ||
      (mnemonicWordsStatePersisted &&
        !this.mnemonicWordsValidation &&
        !this.notificationEnabled &&
        !hasPrivateKeyInKeychain) ||
      (mnemonicWordsStatePersisted &&
        this.notificationEnabled === null &&
        hasPrivateKeyInKeychain) ||
      (!mnemonicWordsStatePersisted && this.notificationEnabled && !hasPrivateKeyInKeychain) ||
      (!mnemonicWordsStatePersisted && !this.notificationEnabled && hasPrivateKeyInKeychain)
    ) {
      mainPage = 'Welcome';
    } else if (
      mnemonicWordsStatePersisted &&
      !this.notificationEnabled &&
      hasPrivateKeyInKeychain
    ) {
      mainPage = 'NotificationPermissionNotGranted';
    } else if (
      (mnemonicWordsStatePersisted &&
        this.mnemonicWordsValidation &&
        this.notificationEnabled &&
        !hasPersistedState &&
        !hasPrivateKeyInKeychain) ||
      (mnemonicWordsStatePersisted &&
        this.notificationEnabled &&
        !hasPersistedState &&
        hasPrivateKeyInKeychain)
    ) {
      mainPage = 'WalletCreation';
    } else if (
      mnemonicWordsStatePersisted &&
      this.notificationEnabled &&
      hasPersistedState &&
      hasPrivateKeyInKeychain
    ) {
      mainPage = 'WalletList';
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
      this.hasTransactions() &&
      this.hasBalance() && this.hasChecksumAddress() && this.hasPrice()
    );
  }

  hasTransactions() {
    return this.transactionsLoaded != null;
  }

  hasBalance = () => {
    const cDaiBalance = new BigNumber(this.balance.cDaiBalance);
    const daiBalance = new BigNumber(this.balance.daiBalance);
    const weiBalance = new BigNumber(this.balance.weiBalance);
    return (
      cDaiBalance.isGreaterThanOrEqualTo(0) &&
      daiBalance.isGreaterThanOrEqualTo(0) &&
      weiBalance.isGreaterThanOrEqualTo(0)
    );
  };

  hasChecksumAddress = () => this.checksumAddress != null;

  hasPrice = () => (
      this.price.eth >= 0 &&
      this.price.eth.length != 0 &&
      this.price.dai >= 0 &&
      this.price.dai.length != 0
    );

  render() {
    return (
      <Container>
        <Title animation="fadeIn" delay={2000}>
          loading
        </Title>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 240;
  text-align: center;
`;

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 40;
  margin-bottom: 16;
  text-align: center;
`);
