'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { Container } from '../components/common';
import BalanceStack from '../navigators/BalanceStack';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import Animation from 'lottie-react-native';
import Loader from '../../assets/loader_animation.json';

class Initial extends Component {
  async componentDidUpdate(prevProps) {
    if (this.props.rehydration != prevProps.rehydration) {
      await this.conditionalNavigation();
    }
  }

  async componentDidMount() {
    await this.conditionalNavigation();
    this.animation.play();
  }

  async conditionalNavigation() {
    const {
      rehydration,
      mnemonicWords,
      mnemonicWordsValidation,
      permissions
    } = this.props;

    if (rehydration) {
      let mnemonicWordsStatePersisted;
      if (mnemonicWords === null) {
        mnemonicWordsStatePersisted = false;
      } else if (mnemonicWords != null) {
        mnemonicWordsStatePersisted = true;
      }

      const hasPersistedState = this.hasPersistedState();

      const hasPrivateKeyInKeychain = await WalletUtilities.privateKeySaved();

      let mainPage = 'Welcome';

      if (
        !mnemonicWordsStatePersisted ||
        (mnemonicWordsStatePersisted &&
          !mnemonicWordsValidation &&
          !permissions.notification &&
          !hasPrivateKeyInKeychain) ||
        (mnemonicWordsStatePersisted &&
          permissions.notification === null &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = 'Welcome';
      } else if (
        mnemonicWordsStatePersisted &&
        !permissions.notification &&
        hasPrivateKeyInKeychain
      ) {
        mainPage = 'NotificationPermissionNotGranted';
      } else if (
        (mnemonicWordsStatePersisted &&
          mnemonicWordsValidation &&
          permissions.notification &&
          !hasPersistedState &&
          !hasPrivateKeyInKeychain) ||
        (mnemonicWordsStatePersisted &&
          permissions.notification &&
          !hasPersistedState &&
          hasPrivateKeyInKeychain)
      ) {
        mainPage = 'WalletCreation';
      } else if (
        mnemonicWordsStatePersisted &&
        permissions.notification &&
        hasPersistedState &&
        hasPrivateKeyInKeychain
      ) {
        mainPage = 'PortfolioHome';
      }

      BalanceStack.navigationOptions = ({ navigation }) => {
        let tabBarVisible;
        if (navigation.state.index >= 0 && mainPage === 'PortfolioHome') {
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
    } else if (!rehydration) {
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
    const { balance } = this.props;
    return (
      new BigNumber(balance.cDai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.dai).isGreaterThanOrEqualTo(0) &&
      new BigNumber(balance.wei).isGreaterThanOrEqualTo(0)
    );
  };

  hasChecksumAddress = () => this.props.checksumAddress != null;

  hasPrice = () => {
    const { price } = this.props;
    return (
      price.eth >= 0 &&
      price.eth.length != 0 &&
      price.dai >= 0 &&
      price.dai.length != 0
    );
  };

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
          <Logo>Goyemon</Logo>
          <Animation
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              width: 120,
              height: 120
            }}
            loop={true}
            source={Loader}
          />
        </LoaderContainer>
      </Container>
    );
  }
}

const LoaderContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
`);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Bold';
  font-size: 40;
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
