'use strict';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
        return <Text>$ {PriceUtilities.convertEthToUsd(this.props.balance.ethBalance)}</Text>;
      } catch (err) {
        console.error(err);
      }
    } else if (this.props.wallet.id === 1) {
      try {
        return <Text>$ {PriceUtilities.convertDaiToUsd(this.props.balance.daiBalance)}</Text>;
      } catch (err) {
        console.error(err);
      }
    }
  }

  renderBalance() {
    if (this.props.wallet.id === 0) {
      return <Text>{this.props.balance.ethBalance} ETH</Text>;
    } else if (this.props.wallet.id === 1) {
      return <Text>{this.props.balance.daiBalance} DAI</Text>;
    }
  }

  renderPrice() {
    if (this.props.wallet.id === 0) {
      return <Text>{this.props.price.ethPrice}</Text>;
    } else if (this.props.wallet.id === 1) {
      return <Text>{this.props.price.daiPrice}</Text>;
    }
  }

  render() {
    const { coin, notation } = this.props.wallet;

    return (
      <Container>
        {this.renderIcon()}
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
  alignItems: center;
  flex: 1;
  flexDirection: row;
  justifyContent: space-between;
  width: 100%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const PriceContainer = styled.View`
  width: 50%;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-size: 20px;
  margin-left: 16px;
  margin-bottom: 4px;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  margin-left: 16px;
`;

const BalanceContainer = styled.View`
  width: 40%;
`;

const BalanceText = styled.Text`
  color: #5f5f5f;
  font-size: 20px;
  margin-left: 16px;
`;

const UsdBalanceText = styled.Text`
  font-size: 22px;
  margin-left: 16px;
  margin-bottom: 4px;
`;

const mapStateToProps = state => ({
  price: state.ReducerPrice.price,
  balance: state.ReducerBalance.balance
});

export default connect(mapStateToProps)(WalletDetail);
