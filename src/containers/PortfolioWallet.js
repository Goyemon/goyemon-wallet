'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  NewHeaderOne,
  NewHeaderThree,
  NewHeaderFour,
} from '../components/common';
import I18n from '../i18n/I18n';
import { RoundDownBigNumberPlacesFour } from '../utilities/BigNumberUtilities';
import TokenBalanceCards from '../components/PortfolioWallet/TokenBalanceCards';
import PriceUtilities from '../utilities/PriceUtilities.js';

class PortfolioWallet extends Component {
  returnBalance = (amount, round, pow, fix) =>
    RoundDownBigNumberPlacesFour(amount)
      .div(new RoundDownBigNumberPlacesFour(round).pow(pow))
      .toFixed(fix);

  render() {
    const { balance, price } = this.props;

    const ethBalance = RoundDownBigNumberPlacesFour(
        Web3.utils.fromWei(balance.wei),
      ).toFixed(4),
      daiBalance = this.returnBalance(balance.dai, 10, 18, 2),
      cdaiBalance = this.returnBalance(balance.cDai, 10, 8, 2),
      plDaiBalance = RoundDownBigNumberPlacesFour(
        balance.pooltogetherDai.committed,
      )
        .div(new RoundDownBigNumberPlacesFour(10).pow(18))
        .toFixed(2);

    const tokenBalanceCards = [
      {
        price: price.eth,
        balance: ethBalance,
        usd: PriceUtilities.convertEthToUsd(ethBalance).toFixed(2),
        icon: require('../../assets/ether_icon.png'),
        token: 'ETH',
      },
      {
        price: price.dai,
        balance: daiBalance,
        usd: PriceUtilities.convertDaiToUsd(daiBalance).toFixed(2),
        icon: require('../../assets/dai_icon.png'),
        token: 'DAI',
      },
      {
        price: price.cdai,
        balance: cdaiBalance,
        usd: PriceUtilities.convertcDaiToUsd(cdaiBalance).toFixed(2),
        icon: require('../../assets/cdai_icon.png'),
        token: 'cDAI',
      },
      {
        price: price.dai,
        balance: plDaiBalance,
        usd: PriceUtilities.convertDaiToUsd(plDaiBalance).toFixed(2),
        icon: require('../../assets/pldai_icon.png'),
        token: 'plDAI',
      },
    ];

    return (
      <RootContainer>
        <NewHeaderOne
          marginTop="112"
          text={I18n.t('portfolio-wallet-header')}
        />
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="144px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <NewHeaderFour
            marginTop="0"
            text={I18n.t('portfolio-wallet-totalbalance')}
          />
          <UsdBalance>
            ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance, cdaiBalance, plDaiBalance)}
          </UsdBalance>
        </UntouchableCardContainer>
        <NewHeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
          text={I18n.t('portfolio-wallet-coins')}
        />
        <TokenBalanceCards cards={tokenBalanceCards} />
      </RootContainer>
    );
  }
}

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price,
});

export default withNavigation(connect(mapStateToProps)(PortfolioWallet));
