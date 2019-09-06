'use strict';
import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';

class WalletDetail extends Component {
  renderIcon() {
    const { coinImageStyle } = styles;
    if (this.props.wallet.id === 0) {
      return <Image source={require('../../assets/ether_icon.png')} style={coinImageStyle} />;
    } else if (this.props.wallet.id === 1) {
      return <Image source={require('../../assets/dai_icon.png')} style={coinImageStyle} />;
    }
  }

  renderBalance() {
    if (this.props.wallet.id === 0) {
      return <Text>{this.props.balance} ETH</Text>;
    } else if (this.props.wallet.id === 1) {
      return <Text>0 DAI</Text>;
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
    const { id, coin, notation, price } = this.props.wallet;
    const { balance } = this.props
    const {
      coinImageStyle
    } = styles;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <Container>
        {this.renderIcon()}
        <View>
          <CoinText>{coin}</CoinText>
          <PriceText>1 {notation} = ${this.renderPrice()}</PriceText>
        </View>
        <BalanceText>{this.renderBalance()}</BalanceText>
      </Container>
    );
  }
}

const styles = {
  coinImageStyle: {
    height: 40,
    width: 40
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: flex-start;
`;

const CoinText = styled.Text`
  font-size: 20px;
  margin-left: 16px;
`;

const PriceText = styled.Text`
  color: #4E4E4E;
  margin-left: 16px;
`;

const BalanceText = styled.Text`
  font-size: 22px;
  margin-left: 16px;
`;

const mapStateToProps = state => ({
    wallets: state.ReducerWallets.wallets,
    web3: state.ReducerWeb3.web3,
    price: state.ReducerPrice.price,
    balance: state.ReducerBalance.balance
  });

export default connect(mapStateToProps)(WalletDetail);
