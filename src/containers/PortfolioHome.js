'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import CompoundIcon from '../../assets/CompoundIcon.js';
import PoolTogetherIcon from '../../assets/PoolTogetherIcon.js';
import {
  RootContainer,
  TouchableCardContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  GoyemonText
} from '../components/common';
import Copy from '../containers/common/Copy';
import FcmPermissions from '../firebase/FcmPermissions.js';
import I18n from '../i18n/I18n';
import PortfolioStack from '../navigators/PortfolioStack';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class PortfolioHome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          color="#5f5f5f"
          name="settings-outline"
          size={28}
          onPress={() => {
            PortfolioStack.navigationOptions = () => {
              const tabBarVisible = false;
              return {
                tabBarVisible
              };
            };
            navigation.navigate('Settings');
          }}
        />
      )
    };
  };

  async componentDidMount() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible
      };
    };
    await FcmPermissions.checkFcmPermissions();
    await this.props.getEthPrice();
    await this.props.getDaiPrice();
  }

  render() {
    const { balance, navigation, checksumAddress } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.wei);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);

    const daiBalance = RoundDownBigNumber(balance.dai)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);

    const compoundDaiBalance = RoundDownBigNumber(balance.compoundDai)
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    const pooltogetherDaiBalance = RoundDownBigNumber(
      balance.pooltogetherDai.open
    )
      .plus(balance.pooltogetherDai.committed)
      .plus(balance.pooltogetherDai.sponsored)
      .div(new RoundDownBigNumber(10).pow(18))
      .toFixed(2);

    const totalBalance =
      parseFloat(PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(compoundDaiBalance)) +
      parseFloat(PriceUtilities.convertDaiToUsd(pooltogetherDaiBalance));

    let truncatedAdderss;
    if (checksumAddress) {
      truncatedAdderss = checksumAddress.substring(0, 24) + '...';
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t('portfolio')}</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="200px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="0">
            {I18n.t('portfolio-home-totalbalance')}
          </HeaderFour>
          <UsdBalance>${totalBalance.toFixed(2)}</UsdBalance>
          <GoyemonText fontSize={16}>{truncatedAdderss}</GoyemonText>
          <AddressActionContainer>
            <Receive
              onPress={() => {
                navigation.navigate('Receive');
              }}
            >
              <Icon name="qrcode" size={20} color="#00a3e2" />
              <ReceiveText>Receive</ReceiveText>
            </Receive>
            <Copy text={checksumAddress} animation={true} />
          </AddressActionContainer>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="8"
          marginLeft="24"
          marginTop="0"
        >
          {I18n.t('portfolio-home-coins')}
        </HeaderThree>
        <CurrencyScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <CurrencyContainer>
            <CurrencyImageContainer>
              <CoinImage source={require('../../assets/ether_icon.png')} />
              <CoinText>ETH</CoinText>
            </CurrencyImageContainer>
            <CurrencyBalanceContainer>
              <UsdBalanceText>
                ${PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
              </UsdBalanceText>
              <BalanceText>
                <GoyemonText fontSize="16">{ethBalance}</GoyemonText>
              </BalanceText>
            </CurrencyBalanceContainer>
          </CurrencyContainer>
          <CurrencyContainer>
            <CurrencyImageContainer>
              <CoinImage source={require('../../assets/dai_icon.png')} />
              <CoinText>DAI</CoinText>
            </CurrencyImageContainer>
            <CurrencyBalanceContainer>
              <UsdBalanceText>
                ${PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
              </UsdBalanceText>
              <BalanceText>
                <GoyemonText fontSize="16">{daiBalance}</GoyemonText>
              </BalanceText>
            </CurrencyBalanceContainer>
          </CurrencyContainer>
        </CurrencyScrollView>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="24"
        >
          {I18n.t('portfolio-home-applications')}
        </HeaderThree>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => navigation.navigate('PortfolioWallet')}
        >
          <IconImageContainer>
            <Icon name="wallet-outline" size={40} color="#5f5f5f" />
          </IconImageContainer>
          <NameContainer>
            <NameText>{I18n.t('portfolio-home-wallet')}</NameText>
            <GoyemonText fontSize={12}>ETH and ERC20</GoyemonText>
          </NameContainer>
          <BalanceContainer>
            <ApplicationBalanceText>
              ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
            </ApplicationBalanceText>
          </BalanceContainer>
        </TouchableCardContainer>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => navigation.navigate('PortfolioCompound')}
        >
          <IconImageContainer>
            <CompoundIcon />
          </IconImageContainer>
          <NameContainer>
            <NameText>Compound</NameText>
          </NameContainer>
          <BalanceContainer>
            <ApplicationBalanceText>
              ${PriceUtilities.convertDaiToUsd(compoundDaiBalance).toFixed(2)}
            </ApplicationBalanceText>
          </BalanceContainer>
        </TouchableCardContainer>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="120px"
          justifyContent="space-between"
          textAlign="left"
          width="90%"
          onPress={() => navigation.navigate('PortfolioPoolTogether')}
        >
          <IconImageContainer>
            <PoolTogetherIcon />
          </IconImageContainer>
          <NameContainer>
            <NameText>PoolTogether</NameText>
          </NameContainer>
          <BalanceContainer>
            <ApplicationBalanceText>
              $
              {PriceUtilities.convertDaiToUsd(pooltogetherDaiBalance).toFixed(
                2
              )}
            </ApplicationBalanceText>
          </BalanceContainer>
        </TouchableCardContainer>
      </RootContainer>
    );
  }
}

const CurrencyScrollView = styled.ScrollView`
  width: 100%;
  margin-left: 5%;
`;

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
  margin-bottom: 12px;
`;

const AddressActionContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const Receive = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 8px;
  margin-right: 8;
`;

const ReceiveText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const CurrencyContainer = styled.View`
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
  margin-right: 16;
  padding: 16px 8px;
  width: 45%;
`;

const CurrencyImageContainer = styled.View`
  align-items: center;
`;

const CurrencyBalanceContainer = styled.View`
  margin-left: 16;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 32px;
  width: 32px;
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

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
`;

const NameContainer = styled.View`
  margin-left: 16;
  width: 45%;
`;

const NameText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const BalanceContainer = styled.View`
  width: 35%;
`;

const ApplicationBalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

const mapDispatchToProps = {
  getEthPrice,
  getDaiPrice
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(PortfolioHome)
);
