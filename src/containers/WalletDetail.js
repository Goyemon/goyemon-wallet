'use strict';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
        const usdPrice = this.props.price.ethPrice;
        const parsedEthBalance = parseFloat(this.props.balance.ethBalance);
        const usdBalance = usdPrice * parsedEthBalance;
        const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
        return <Text>$ {roundedUsdBalance}</Text>;
      } catch (err) {
        console.error(err);
      }
    } else if (this.props.wallet.id === 1) {
      try {
        const usdPrice = this.props.price.daiPrice;
        const parsedDaiBalance = parseFloat(this.props.balance.daiBalance);
        const usdBalance = usdPrice * parsedDaiBalance;
        const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
        return <Text>$ {roundedUsdBalance}</Text>;
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

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <Container>
        {this.renderIcon()}
        <View>
          <CoinText>{coin}</CoinText>
          <PriceText>
            1 {notation} = ${this.renderPrice()}
          </PriceText>
        </View>
        <View>
          <UsdBalanceText>{this.renderUsdBalance()}</UsdBalanceText>
          <BalanceText>{this.renderBalance()}</BalanceText>
        </View>
      </Container>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: flex-start;
`;

const CoinImage = styled.Image`
  height: 40px;
  width: 40px;
`;

const CoinText = styled.Text`
  font-size: 20px;
  margin-left: 16px;
`;

const PriceText = styled.Text`
  color: #5f5f5f;
  margin-left: 16px;
`;

const BalanceText = styled.Text`
  font-size: 22px;
  margin-left: 16px;
`;

const UsdBalanceText = styled.Text`
  font-size: 22px;
  margin-left: 16px;
`;

const mapStateToProps = state => ({
  web3: state.ReducerWeb3.web3,
  price: state.ReducerPrice.price,
  balance: state.ReducerBalance.balance
});

export default connect(mapStateToProps)(WalletDetail);
