'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Web3 from 'web3';
import { Container, CrypterestText } from '../components/common';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';

class WalletDetail extends Component {
  renderIcon() {
    if (this.props.currency.id === 0) {
      return <CoinImage source={require('../../assets/ether_icon.png')} />;
    } else if (this.props.currency.id === 1) {
      return <CoinImage source={require('../../assets/dai_icon.png')} />;
    }
  }

  renderUsdBalance(ethBalance, daiBalance) {
    let ethUsdBalance = PriceUtilities.convertEthToUsd(ethBalance);
    ethUsdBalance = ethUsdBalance.toFixed(2);
    let daiUsdBalance = PriceUtilities.convertDaiToUsd(daiBalance);
    daiUsdBalance = daiUsdBalance.toFixed(2);
    if (this.props.currency.id === 0) {
      try {
        return <CrypterestText fontSize="20">${ethUsdBalance}</CrypterestText>;
      } catch (err) {
        LogUtilities.logError(err);
      }
    } else if (this.props.currency.id === 1) {
      try {
        return <CrypterestText fontSize="20">${daiUsdBalance}</CrypterestText>;
      } catch (err) {
        LogUtilities.logError(err);
      }
    }
  }

  renderBalance(ethBalance, daiBalance) {
    if (this.props.currency.id === 0) {
      return <CrypterestText fontSize="20">{ethBalance} ETH</CrypterestText>;
    } else if (this.props.currency.id === 1) {
      return <CrypterestText fontSize="20">{daiBalance} DAI</CrypterestText>;
    }
  }

  renderPrice() {
    if (this.props.currency.id === 0) {
      return <CrypterestText fontSize="16">{this.props.price.eth}</CrypterestText>;
    } else if (this.props.currency.id === 1) {
      return <CrypterestText fontSize="16">{this.props.price.dai}</CrypterestText>;
    }
  }

  render() {
    const { name, notation } = this.props.currency;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    let ethBalance = Web3.utils.fromWei(this.props.balance.weiBalance);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);
    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(new BigNumber(10).pow(18))
      .toString();

    return (
      <Container alignItems="center" flexDirection="column"  flexDirection="row" justifyContent="space-between" marginTop={0} width="100%">
      <CoinImageContainer>{this.renderIcon()}</CoinImageContainer>
        <PriceContainer>
          <CoinText>{name}</CoinText>
          <PriceText>
            1 {notation} = ${this.renderPrice()}
          </PriceText>
        </PriceContainer>
        <BalanceContainer>
          <UsdBalanceText>{this.renderUsdBalance(ethBalance, daiBalance)}</UsdBalanceText>
          <BalanceText>{this.renderBalance(ethBalance, daiBalance)}</BalanceText>
        </BalanceContainer>
      </Container>
    );
  }
}

const CoinImageContainer = styled.View`
  width: 15%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  margin-left: 16;
  width: 42.5%;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 4;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const BalanceContainer = styled.View`
  width: 42.5%;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

const UsdBalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 22;
  margin-bottom: 4;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  price: state.ReducerPrice.price
});

export default connect(mapStateToProps)(WalletDetail);
