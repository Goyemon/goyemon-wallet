'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  GoyemonText,
  ReceiveIcon
} from '../components/common';
import CoinBox from './PortfolioHome/CoinBox'
import ApplicationBox from './PortfolioHome/ApplicationBox'
import Copy from '../containers/common/Copy';
import FcmPermissions from '../firebase/FcmPermissions.js';
import I18n from '../i18n/I18n';
import PortfolioStack from '../navigators/PortfolioStack';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';
import LogUtilities from '../utilities/LogUtilities.js';

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
    LogUtilities.toDebugScreen('PortfolioHome componentDidMount', this.props.balance);
  }

  returnBalance = (amount, pow, fix) => RoundDownBigNumberPlacesFour(amount)
  .div(new RoundDownBigNumberPlacesFour(10).pow(pow))
  .toFixed(fix);

  render() {
    const { balance, navigation, checksumAddress } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.wei);
    ethBalance = RoundDownBigNumberPlacesFour(ethBalance).toFixed(4);

    const daiBalance = this.returnBalance(balance.dai, 18, 2)

    const cdaiBalance = this.returnBalance(balance.cDai, 18, 2)

    const pldaiBalance = [
      this.returnBalance(balance.pooltogetherDai.open, 18, 0),
      this.returnBalance(balance.pooltogetherDai.committed, 18, 0),
      this.returnBalance(balance.pooltogetherDai.sponsored, 18, 0)
    ]

    const compoundDaiBalance = RoundDownBigNumberPlacesFour(balance.compoundDai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(36))
      .toString();

    const pooltogetherDaiBalance = RoundDownBigNumberPlacesFour(
      balance.pooltogetherDai.open
    )
      .plus(balance.pooltogetherDai.committed)
      .plus(balance.pooltogetherDai.sponsored)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
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
          height="240px"
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
          <IconContainer>
            <ReceiveIconContainer>
              <ReceiveIcon
                onPress={() => {
                  navigation.navigate('Receive');
                }}
              />
              <GoyemonText fontSize={14}>Receive</GoyemonText>
            </ReceiveIconContainer>
            <Copy text={checksumAddress} animation={true} icon={true} />
          </IconContainer>
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
          contentContainerStyle={{ width: `${150}%` }}
          showsHorizontalScrollIndicator={false}
        >
          <CoinBox
            source={require('../../assets/ether_icon.png')}
            token="ETH"
            usd={PriceUtilities.convertEthToUsd(ethBalance).toFixed(2)}
            balance={ethBalance}
          />

          <CoinBox
            source={require('../../assets/dai_icon.png')}
            token="DAI"
            usd={PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2)}
            balance={daiBalance}
          />

          <CoinBox
            source={require('../../assets/cdai_icon.png')}
            token="cDAI"
            usd={PriceUtilities.convertDaiToUsd(cdaiBalance).toFixed(2)}
            balance={cdaiBalance}
          />

          <CoinBox
            source={require('../../assets/pldai_icon.png')}
            token="plDAI"
            usd={PriceUtilities.convertDaiToUsd(pooltogetherDaiBalance).toFixed(2)}
            balance={pldaiBalance}
          />
        </CurrencyScrollView>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="24"
        >
          {I18n.t('portfolio-home-applications')}
        </HeaderThree>
        <ApplicationBox
          balance={PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
          name={I18n.t('portfolio-home-wallet')}
          onPress={() => navigation.navigate('PortfolioWallet')}
        />
        <ApplicationBox
          balance={PriceUtilities.convertDaiToUsd(compoundDaiBalance).toFixed(2)}
          name='Compound'
          onPress={() => navigation.navigate('PortfolioCompound')}
        />
        <ApplicationBox
          balance={PriceUtilities.convertDaiToUsd(pooltogetherDaiBalance).toFixed(2)}
          name='PoolTogether'
          onPress={() => navigation.navigate('PortfolioPoolTogether')}
        />
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

const IconContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ReceiveIconContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin-top: 16;
  margin-right: 16;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(PortfolioHome));
