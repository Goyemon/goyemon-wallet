'use strict';
import React, { Component } from 'react';
import { Text, View, Linking, Image } from 'react-native';
import { Card } from '../components/common';
import { connect } from "react-redux";
import { getEthPrice, getDaiPrice } from "../actions/ActionWallets";

class WalletDetail extends Component {
  componentDidMount() {
    this.props.getEthPrice();
    this.props.getDaiPrice();
  }

  renderIcon() {
    const { coinImageStyle } = styles;
    if (this.props.wallet.id === 0) {
      return <Image source={require('../../assets/ether_icon.png')} style={coinImageStyle} />;
    } else if (this.props.wallet.id === 1) {
      return <Image source={require('../../assets/dai_icon.png')} style={coinImageStyle} />;
    }
  }

  render() {
    const { id, coin, price, balance } = this.props.wallet;
    const {
      WalletListStyle,
      WalletStyleMiddleContainer,
      coinImageStyle,
      coinTextStyle,
      priceTextStyle,
      balanceTextStyle
    } = styles;
    return (
      <Card>
        <View style={WalletListStyle}>
          {this.renderIcon()}
        </View>
        <View style={WalletListStyle}>
          <Text style={[WalletStyleMiddleContainer, coinTextStyle]}>{coin}</Text>
          <Text style={[WalletStyleMiddleContainer, priceTextStyle]}>${price}</Text>
        </View>
        <View style={WalletListStyle}>
          <Text style={balanceTextStyle}>balance {balance}</Text>
        </View>
      </Card>
    );
  }
}

const styles = {
  WalletListStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  WalletStyleMiddleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  coinImageStyle: {
    height: 40,
    width: 40
  },
  coinTextStyle: {
    fontSize: 16
  },
  priceTextStyle: {
    fontSize: 16
  },
  balanceTextStyle: {
    fontSize: 24
  }
};

const mapStateToProps = state => {
  return { wallets: state.ReducerWallets.wallets }
}

const mapDispatchToProps = {
    getEthPrice,
    getDaiPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail);
