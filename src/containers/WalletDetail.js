'use strict';
import BigNumber from "bignumber.js"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components';
import Web3 from 'web3';
import { CrypterestText } from '../components/common';
import DebugUtilities from '../utilities/DebugUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';

class WalletDetail extends Component {
  renderIcon() {
    if (this.props.wallet.id === 0) {
      return <CoinImage source={require('../../assets/ether_icon.png')} />;
    } else if (this.props.wallet.id === 1) {
      return <CoinImage source={require('../../assets/dai_icon.png')} />;
    }
  }

  renderUsdBalance(ethBalance, daiBalance) {
    let ethUsdBalance = PriceUtilities.convertEthToUsd(ethBalance);
    ethUsdBalance = ethUsdBalance.toFixed(2);
    let daiUsdBalance = PriceUtilities.convertDaiToUsd(daiBalance);
    daiUsdBalance = daiUsdBalance.toFixed(2);
    if (this.props.wallet.id === 0) {
      try {
        return (
          <CrypterestText fontSize="20">
            $ {ethUsdBalance}
          </CrypterestText>
        );
      } catch (err) {
        DebugUtilities.logError(err);
      }
    } else if (this.props.wallet.id === 1) {
      try {
        return (
          <CrypterestText fontSize="20">
            $ {daiUsdBalance}
          </CrypterestText>
        );
      } catch (err) {
        DebugUtilities.logError(err);
      }
    }
  }

  renderBalance(ethBalance, daiBalance) {
    if (this.props.wallet.id === 0) {
      return <CrypterestText fontSize="20">{ethBalance} ETH</CrypterestText>;
    } else if (this.props.wallet.id === 1) {
      return <CrypterestText fontSize="20">{daiBalance} DAI</CrypterestText>;
    }
  }

  renderPrice() {
    if (this.props.wallet.id === 0) {
      return <CrypterestText fontSize="16">{this.props.price.eth}</CrypterestText>;
    } else if (this.props.wallet.id === 1) {
      return <CrypterestText fontSize="16">{this.props.price.dai}</CrypterestText>;
    }
  }

  render() {
    const { coin, notation } = this.props.wallet;

    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    let ethBalance = Web3.utils.fromWei(this.props.balance.weiBalance);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);
    const daiBalance = RoundDownBigNumber(this.props.balance.daiBalance)
      .div(10 ** 18)
      .toString();

    return (
      <Container>
        <CoinImageContainer>{this.renderIcon()}</CoinImageContainer>
        <PriceContainer>
          <CoinText>{coin}</CoinText>
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

const Container = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CoinImageContainer = styled.View`
  width: 15%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  width: 42.5%;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-left: 16;
  margin-bottom: 4;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  margin-left: 16;
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
  font-family: 'HKGrotesk-Regular';
  font-size: 22;
  margin-bottom: 4;
`;

const mapStateToProps = state => ({
  balance: state.ReducerBalance.balance,
  price: state.ReducerPrice.price
});

export default connect(mapStateToProps)(WalletDetail);
