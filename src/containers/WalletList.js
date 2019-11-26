'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Text } from 'react-native';
import { RootContainer, QRCodeIcon, TouchableCardContainer, HeaderOne, HeaderThree } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';
import PriceUtilities from '../utilities/PriceUtilities.js';
import { saveNotificationPermission } from '../actions/ActionNotificationPermission';
import firebase from 'react-native-firebase';

class WalletList extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      headerRight: (
        <QRCodeIcon
          onPress={() => {
            navigation.navigate('QRCode');
          }}
        />
      )
    }
  }

  async componentDidMount() {
    await this.checkFcmPermissions();
  }

  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('user has permissions');
      this.props.saveNotificationPermission(true);
    } else {
      console.log("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        console.log('User has authorised');
        this.props.saveNotificationPermission(true);
      } catch (error) {
        console.log('User has rejected permissions');
        this.props.saveNotificationPermission(false);
      }
    }
  }

  getTotalBalance(ethBalance, daiBalance) {
    let totalUsdBalance =
      parseFloat(PriceUtilities.convertEthToUsd(ethBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(daiBalance));
    totalUsdBalance = parseFloat(totalUsdBalance).toFixed(2);
    return totalUsdBalance;
  }

  render() {
    const { wallets, balance, navigation } = this.props;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Wallets</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>
            Total Balance
          </BalanceText>
          <UsdBalance>${this.getTotalBalance(balance.ethBalance, balance.daiBalance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderThree marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderThree>
        {wallets.map(wallet => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="flex-start"
            textAlign="left"
            width="95%"
            key={wallet.id}
            onPress={
              wallet.coin === 'Ether'
                ? () => navigation.navigate('Ethereum')
                : () => navigation.navigate('Dai')
            }
          >
            <WalletDetail key={wallet.id} wallet={wallet} />
          </TouchableCardContainer>
        ))}
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #fff;
  height: 160px;
  margin-top: 24px;
  padding: 24px;
`;

const BalanceText = styled.Text`
  color: #5F5F5F;
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const mapStateToProps = state => ({
  wallets: state.ReducerWallets.wallets,
  web3: state.ReducerWeb3.web3,
  balance: state.ReducerBalance.balance
});

const mapDispatchToProps = {
  saveNotificationPermission
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WalletList)
);
