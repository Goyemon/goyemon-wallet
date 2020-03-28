'use strict';
import React, { Component } from 'react';
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
  CrypterestText,
  SettingsIcon
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class BalanceHome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <SettingsIcon
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
      ),
      headerStyle: { height: 80 }
    };
  };

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
        <CurrencyScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8"
            flexDirection="row"
            height="120px"
            justifyContent="space-between"
            marginTop={8}
            textAlign="left"
            width="50%"
          >
            <CurrencyImageContainer>
              <CoinImage source={require('../../assets/ether_icon.png')} />
              <CoinText>ETH</CoinText>
            </CurrencyImageContainer>
            <CurrencyBalanceContainer>
              <UsdBalanceText>
                ${PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
              </UsdBalanceText>
              <BalanceText>
                <CrypterestText fontSize="16">{ethBalance} ETH</CrypterestText>
              </BalanceText>
            </CurrencyBalanceContainer>
          </UntouchableCardContainer>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8"
            flexDirection="row"
            height="120px"
            justifyContent="space-between"
            marginTop={8}
            textAlign="left"
            width="50%"
          >
            <CurrencyImageContainer>
              <CoinImage source={require('../../assets/dai_icon.png')} />
              <CoinText>DAI</CoinText>
            </CurrencyImageContainer>
            <CurrencyBalanceContainer>
              <UsdBalanceText>
                ${PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
              </UsdBalanceText>
              <BalanceText>
                <CrypterestText fontSize="16">{daiBalance} DAI</CrypterestText>
              </BalanceText>
            </CurrencyBalanceContainer>
          </UntouchableCardContainer>
        </CurrencyScrollView>
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

const CurrencyScrollView = styled.ScrollView`
  width: 100%;
`;

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

const CurrencyImageContainer = styled.View`
  align-items: center;
  width: 50%;
`;

const CurrencyBalanceContainer = styled.View`
  width: 50%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
  margin-bottom: 4;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const UsdBalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-bottom: 4;
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
  font-size: 16;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(BalanceHome));
