'use strict';
import React, { Component } from 'react';
import { Text, View, Linking, Image } from 'react-native';
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

  render() {
    const { id, coin, price } = this.props.wallet;
    const { balance } = this.props
    const {
      WalletStyleMiddleContainer,
      coinImageStyle,
      coinTextStyle,
      priceTextStyle,
      balanceTextStyle
    } = styles;

    if (!this.props.web3.eth) {
      return <Text>loading...</Text>;
    }

    return (
      <Container>
        <View>{this.renderIcon()}</View>
        <View>
          <Text style={[WalletStyleMiddleContainer, coinTextStyle]}>{coin}</Text>
          <Text style={[WalletStyleMiddleContainer, priceTextStyle]}>market price ${price}</Text>
        </View>
        <View>
          <Text style={balanceTextStyle}>{this.renderBalance()}</Text>
        </View>
      </Container>
    );
  }
}

const styles = {
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
    fontSize: 16
  }
};

const Container = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const mapStateToProps = state => ({
    wallets: state.ReducerWallets.wallets,
    web3: state.ReducerWeb3.web3,
    balance: state.ReducerBalance.balance
  });

export default connect(mapStateToProps)(WalletDetail);
