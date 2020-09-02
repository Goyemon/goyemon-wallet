'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  NewHeaderOne,
  NewHeaderThree,
  NewHeaderFour
} from '../../common';
import I18n from '../../../i18n/I18n';
import { RoundDownBigNumberPlacesFour } from '../../../utilities/BigNumberUtilities';
import TokenBalanceCards from './TokenBalanceCards';
import PriceUtilities from '../../../utilities/PriceUtilities';

class PortfolioWallet extends Component {
  returnBalance = (amount, round, pow, fix) =>
    RoundDownBigNumberPlacesFour(amount)
      .div(new RoundDownBigNumberPlacesFour(round).pow(pow))
      .toFixed(fix);

  render() {
    const { balance, price } = this.props;

    const ETHBalance = RoundDownBigNumberPlacesFour(
        Web3.utils.fromWei(balance.wei)
      ).toFixed(4),
      DAIBalance = this.returnBalance(balance.dai, 10, 18, 2),
      CDAIBalance = this.returnBalance(balance.cDai, 10, 8, 2),
      PLDAIBalance = this.returnBalance(
        balance.pooltogetherDai.committed,
        10,
        18,
        2
      );

    const tokenBalanceCards = [
      {
        price: price.eth,
        balance: ETHBalance,
        usd: PriceUtilities.convertETHToUSD(ETHBalance).toFixed(2),
        icon: require('../../../../assets/ether_icon.png'),
        token: 'ETH'
      },
      {
        price: price.dai,
        balance: DAIBalance,
        usd: PriceUtilities.convertDAIToUSD(DAIBalance).toFixed(2),
        icon: require('../../../../assets/dai_icon.png'),
        token: 'DAI'
      },
      {
        price: parseFloat(price.cdai).toFixed(2),
        balance: CDAIBalance,
        usd: PriceUtilities.convertCDAIToUSD(CDAIBalance).toFixed(2),
        icon: require('../../../../assets/cdai_icon.png'),
        token: 'cDAI'
      },
      {
        price: price.dai,
        balance: PLDAIBalance,
        usd: PriceUtilities.convertDAIToUSD(PLDAIBalance).toFixed(2),
        icon: require('../../../../assets/pldai_icon.png'),
        token: 'plDAI'
      }
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
            $
            {PriceUtilities.getTotalWalletBalance(
              ETHBalance,
              DAIBalance,
              CDAIBalance,
              PLDAIBalance
            )}
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
  price: state.ReducerPrice.price
});

export default connect(mapStateToProps)(PortfolioWallet);
