'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import styled from 'styled-components';
import { CrypterestText } from '../components/common';
import PriceUtilities from '../utilities/PriceUtilities.js';

class WalletDetail extends Component {
  renderIcon() {
    if (this.props.wallet.id === 0) {
      return <CoinImage source={require('../../assets/ether_icon.png')} />;
    } else if (this.props.wallet.id === 1) {
      return <CoinImage source={require('../../assets/dai_icon.png')} />;
    }
  }

  renderUsdBalance() {
    if (this.props.wallet.id === 0) {
      try {
        return (
          <CrypterestText fontSize="20">
            $ {PriceUtilities.convertEthToUsd(this.props.balance.ethBalance)}
          </CrypterestText>
        );
      } catch (err) {
        console.error(err);
      }
    } else if (this.props.wallet.id === 1) {
      try {
        return (
          <CrypterestText fontSize="20">
            $ {PriceUtilities.convertDaiToUsd(this.props.balance.daiBalance)}
          </CrypterestText>
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  renderBalance() {
    if (this.props.wallet.id === 0) {
      return <CrypterestText fontSize="20">{this.props.balance.ethBalance} ETH</CrypterestText>;
    } else if (this.props.wallet.id === 1) {
      return <CrypterestText fontSize="20">{this.props.balance.daiBalance} DAI</CrypterestText>;
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

    return (
      <Container>
        <CoinImageContainer>
          {this.renderIcon()}
        </CoinImageContainer>
        <PriceContainer>
          <CoinText>{coin}</CoinText>
          <PriceText>
            1 {notation} = ${this.renderPrice()}
          </PriceText>
        </PriceContainer>
        <BalanceContainer>
          <UsdBalanceText>{this.renderUsdBalance()}</UsdBalanceText>
          <BalanceText>{this.renderBalance()}</BalanceText>
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
  width: 12%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  width: 44%;
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
  width: 44%;
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
  price: state.ReducerPrice.price,
  balance: state.ReducerBalance.balance
});

export default connect(mapStateToProps)(WalletDetail);
