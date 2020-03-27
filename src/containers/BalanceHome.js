'use strict';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import CompoundIcon from '../../assets/CompoundIcon.js';
import WalletIcon from '../../assets/WalletIcon.js';
import PoolTogetherIcon from '../../assets/PoolTogetherIcon.js';
import {
  RootContainer,
  TouchableCardContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderFour,
  CrypterestText
} from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import FcmPermissions from '../firebase/FcmPermissions.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class BalanceHome extends Component {
  async componentDidMount() {
    await FcmPermissions.checkFcmPermissions();
  }

  render() {
    const { balance, navigation } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.weiBalance);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);

    const daiBalance = RoundDownBigNumber(balance.daiBalance)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    const daiSavingsBalance = RoundDownBigNumber(balance.daiSavingsBalance)
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    const totalBalance =
      parseFloat(PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(daiSavingsBalance));

    let truncatedAdderss;
    if (this.props.checksumAddress) {
      truncatedAdderss = this.props.checksumAddress.substring(0, 24) + '...';
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Balance</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">total balance</HeaderFour>
          <UsdBalance>${totalBalance}</UsdBalance>
          <AddressContainer
            onPress={() => {
              navigation.navigate('Receive');
            }}
          >
            <Icon name="qrcode" size={20} color="#5f5f5f" />
            <Address>{truncatedAdderss}</Address>
          </AddressContainer>
        </UntouchableCardContainer>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.currencies.map(currency => (
            <TouchableCardContainer
              alignItems="center"
              flexDirection="row"
              height="120px"
              justifyContent="flex-start"
              textAlign="left"
              width="240px"
              key={currency.id}
              onPress={
                currency.name === 'Ether'
                  ? () => navigation.navigate('Ethereum')
                  : () => navigation.navigate('Dai')
              }
            >
              <WalletDetail key={currency.id} currency={currency} />
            </TouchableCardContainer>
          ))}
        </ScrollView>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => navigation.navigate('BalanceWallet')}
        >
          <IconImageContainer>
            <WalletIcon />
          </IconImageContainer>
          <NameContainer>
            <NameText>Wallet</NameText>
            <CrypterestText fontSize={12}>ETH and ERC20</CrypterestText>
          </NameContainer>
          <BalanceContainer>
            <CoinText>
              ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
            </CoinText>
          </BalanceContainer>
        </TouchableCardContainer>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => navigation.navigate('BalanceCompound')}
        >
          <IconImageContainer>
            <CompoundIcon />
          </IconImageContainer>
          <NameContainer>
            <NameText>Compound</NameText>
          </NameContainer>
          <BalanceContainer>
            <CoinText>
              ${PriceUtilities.convertDaiToUsd(daiSavingsBalance)}
            </CoinText>
          </BalanceContainer>
        </TouchableCardContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <IconImageContainer>
            <PoolTogetherIcon />
          </IconImageContainer>
          <NameContainer>
            <NameText>PoolTogether</NameText>
          </NameContainer>
          <BalanceContainer>
            <CoinText>coming soon!</CoinText>
          </BalanceContainer>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const Address = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
  margin-left: 8;
`;

const AddressContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 12px auto;
  width: 80%;
`;

const IconImageContainer = styled.View`
  align-items: center;
  width: 20%;
`;

const NameContainer = styled.View`
  margin-left: 16;
  width: 40%;
`;

const NameText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const BalanceContainer = styled.View`
  width: 40%;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  currencies: state.ReducerCurrencies.currencies,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(BalanceHome));
