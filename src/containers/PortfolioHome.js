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
  NewHeaderThree,
  HeaderFour,
  GoyemonText,
  ReceiveIcon,
} from '../components/common';
import ApplicationBoxes from '../components/PortfolioHome/ApplicationBoxes';
import Copy from '../containers/common/Copy';
import FcmPermissions from '../firebase/FcmPermissions.js';
import I18n from '../i18n/I18n';
import PortfolioStack from '../navigators/PortfolioStack';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';
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
                tabBarVisible,
              };
            };
            navigation.navigate('Settings');
          }}
        />
      ),
    };
  };

  async componentDidMount() {
    PortfolioStack.navigationOptions = () => {
      const tabBarVisible = true;
      return {
        tabBarVisible,
      };
    };
    await FcmPermissions.checkFcmPermissions();
  }

  returnBalance = (amount, round, pow, fix) =>
    RoundDownBigNumberPlacesFour(amount)
      .div(new RoundDownBigNumberPlacesFour(round).pow(pow))
      .toFixed(fix);

  render() {
    const { balance, navigation, checksumAddress } = this.props;

    const ETHBalance = RoundDownBigNumberPlacesFour(
        Web3.utils.fromWei(balance.wei),
      ).toFixed(4),
      DAIBalance = this.returnBalance(balance.dai, 10, 18, 2),
      CDAIBalance = this.returnBalance(balance.cDai, 10, 8, 2),
      PLDAIBalance = this.returnBalance(
        balance.pooltogetherDai.committed,
        10,
        18,
        0,
      );

    const compoundDAIBalance = RoundDownBigNumberPlacesFour(balance.compoundDai)
      .div(new RoundDownBigNumberPlacesFour(10).pow(36))
      .toString();

    const poolTogetherDAIBalance = RoundDownBigNumberPlacesFour(
      balance.pooltogetherDai.open,
    )
      .plus(balance.pooltogetherDai.committed)
      .plus(balance.pooltogetherDai.sponsored)
      .div(new RoundDownBigNumberPlacesFour(10).pow(18))
      .toFixed(2);

    const totalBalance =
      parseFloat(PriceUtilities.getTotalWalletBalance(ETHBalance, DAIBalance, CDAIBalance, PLDAIBalance));

    const applicationBoxes = [
      {
        balance: PriceUtilities.getTotalWalletBalance(ETHBalance, DAIBalance, CDAIBalance, PLDAIBalance),
        name: I18n.t('portfolio-home-wallet'),
        event: () => navigation.navigate('PortfolioWallet'),
      },
      {
        balance: PriceUtilities.convertDAIToUSD(compoundDAIBalance).toFixed(2),
        name: 'Compound',
        event: () => navigation.navigate('PortfolioCompound'),
      },
      {
        balance: PriceUtilities.convertDAIToUSD(poolTogetherDAIBalance).toFixed(
          2,
        ),
        name: 'PoolTogether',
        event: () => navigation.navigate('PortfolioPoolTogether'),
      },
    ];

    let truncatedAdderss;
    if (checksumAddress)
      truncatedAdderss = checksumAddress.substring(0, 24) + '...';

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
        <NewHeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
          text={I18n.t('portfolio-home-applications')}
        />
        <ApplicationBoxes boxes={applicationBoxes} />
      </RootContainer>
    );
  }
}

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
  price: state.ReducerPrice.price,
});

export default withNavigation(connect(mapStateToProps)(PortfolioHome));
