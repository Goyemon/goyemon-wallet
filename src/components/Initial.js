'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { Container, Loader } from '../components/common';
import HomeStack from '../navigators/HomeStack';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class Initial extends Component {
  async componentDidUpdate(prevProps) {
    if (this.props.rehydration != prevProps.rehydration) {
      await this.conditionalNavigation();
    }
  }

  async componentDidMount() {
    await this.conditionalNavigation();
  }

  async conditionalNavigation() {
    if (this.props.rehydration) {
      let mnemonicWordsStatePersisted;
      if (this.props.mnemonicWords === null) {
        mnemonicWordsStatePersisted = false;
      } else if (this.props.mnemonicWords != null) {
        mnemonicWordsStatePersisted = true;
      }

      const hasPersistedState = this.hasPersistedState();

      const hasPrivateKeyInKeychain = await WalletUtilities.privateKeySaved();

      let mainPage = 'Welcome';

      if (
        !mnemonicWordsStatePersisted ||
        (mnemonicWordsStatePersisted &&
          !this.props.mnemonicWordsValidation &&
          !this.props.permissions.notification &&
          !hasPrivateKeyInKeychain) ||
        (mnemonicWordsStatePersisted &&
          this.props.permissions.notification === null &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = 'Welcome';
      } else if (
        mnemonicWordsStatePersisted &&
        !this.props.permissions.notification &&
        hasPrivateKeyInKeychain
      ) {
        mainPage = 'NotificationPermissionNotGranted';
      } else if (
        (mnemonicWordsStatePersisted &&
          this.props.mnemonicWordsValidation &&
          this.props.permissions.notification &&
          !hasPersistedState &&
          !hasPrivateKeyInKeychain) ||
        (mnemonicWordsStatePersisted &&
          this.props.permissions.notification &&
          !hasPersistedState &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = 'WalletCreation';
      } else if (
        mnemonicWordsStatePersisted &&
        this.props.permissions.notification &&
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
    } else if (!this.props.rehydration) {
      LogUtilities.logInfo('rehydration is not done yet');
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
    const cDaiBalance = new BigNumber(this.props.balance.cDaiBalance);
    const daiBalance = new BigNumber(this.props.balance.daiBalance);
    const weiBalance = new BigNumber(this.props.balance.weiBalance);
    return (
      cDaiBalance.isGreaterThanOrEqualTo(0) &&
      daiBalance.isGreaterThanOrEqualTo(0) &&
      weiBalance.isGreaterThanOrEqualTo(0)
    );
  };

  hasChecksumAddress = () => this.props.checksumAddress != null;

  hasPrice = () =>
    this.props.price.eth >= 0 &&
    this.props.price.eth.length != 0 &&
    this.props.price.dai >= 0 &&
    this.props.price.dai.length != 0;

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
          <Logo>Crypterest</Logo>
          <Loader animating={true} size="large" />
        </LoaderContainer>
      </Container>
    );
  }
}

const LoaderContainer = Animatable.createAnimatableComponent(styled.View``);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Bold';
  font-size: 40;
  margin-bottom: 48;
  text-align: center;
  text-transform: uppercase;
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

export default connect(mapStateToProps)(Initial);
