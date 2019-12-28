'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  QRCodeIcon,
  TouchableCardContainer,
  HeaderOne,
  HeaderThree
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletDetail from '../containers/WalletDetail';

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
    };
  };

  async componentDidMount() {
    await FcmPermissions.checkFcmPermissions();
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

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Wallets</HeaderOne>
        <CardContainerWithoutFeedback>
          <BalanceText>Total Balance</BalanceText>
          <UsdBalance>${this.getTotalBalance(balance.ethBalance, balance.daiBalance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderThree>
        {wallets.map(wallet => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="flex-start"
            textAlign="left"
            width="90%"
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
  height: 176px;
  margin-top: 24px;
  padding: 24px;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32px;
`;

const mapStateToProps = state => ({
  wallets: state.ReducerWallets.wallets,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(WalletList));
