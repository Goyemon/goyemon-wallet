'use strict';
import React, { Component } from 'react';
import { Text, View, Linking, Image } from 'react-native';
import { Card } from '../components/common';
import { connect } from "react-redux";
import { getEthPrice, getDaiPrice } from "../actions/ActionWallets";

class WalletDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: "0.0"
    };
  }

  async componentDidMount() {
    this.props.getEthPrice();
    this.props.getDaiPrice();
    const newBalanceInWei = await this.getBalance(this.props.checksumAddress);
    const newBalanceInEther = await this.props.web3.utils.fromWei(newBalanceInWei, 'ether');
    await this.setState({balance: newBalanceInEther});
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch(err) {
      console.error(err);
    }
  }

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
      return <Text>{this.state.balance} ETH</Text>;
    } else if (this.props.wallet.id === 1) {
      return <Text>0 DAI</Text>;
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

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <Card>
        <View style={WalletListStyle}>
          {this.renderIcon()}
        </View>
        <View style={WalletListStyle}>
          <Text style={[WalletStyleMiddleContainer, coinTextStyle]}>{coin}</Text>
          <Text style={[WalletStyleMiddleContainer, priceTextStyle]}>${price}</Text>
        </View>
        <View>
          <Text style={balanceTextStyle}>
            {this.renderBalance()}
          </Text>
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
  return {
    wallets: state.ReducerWallets.wallets,
    web3: state.ReducerWeb3.web3,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
 }
}

const mapDispatchToProps = {
    getEthPrice,
    getDaiPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail);
