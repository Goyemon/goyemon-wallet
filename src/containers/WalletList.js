'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';
import { getEthPrice, getDaiPrice } from "../actions/ActionWallets";

class WalletList extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: "0.0",
      usdBalance: "0.0"
    };
  }

  async componentDidMount() {
    await this.props.getEthPrice();
    const newBalanceInWei = await this.getBalance(this.props.checksumAddress);
    const newBalanceInEther = await this.props.web3.utils.fromWei(newBalanceInWei, 'ether');
    await this.setState({balance: newBalanceInEther});
    await this.setState({usdBalance: await this.getUsdBalance()});
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch(err) {
      console.error(err);
    }
  }

  async getUsdBalance() {
    try {
      const usdPrice = this.props.wallets[0].price;
      const ethBalance = parseFloat(this.state.balance);
      const usdBalance = usdPrice * ethBalance;
      return usdBalance;
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const { wallets, navigation } = this.props;

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <ScrollView>
        <CardContainerWithoutFeedback>
          <Text>TOTAL BALANCE</Text>
          <Text>{this.state.balance} ETH</Text>
          <Text>{this.state.usdBalance} USD</Text>
        </CardContainerWithoutFeedback>
        {wallets.map(wallet => (
          <CardContainer
            key={wallet.id}
            onPress={
              wallet.coin === 'Ether'
                ? () => navigation.navigate('Ethereum')
                : () => navigation.navigate('Dai')
            }
          >
            <WalletDetail key={wallet.id} wallet={wallet} />
          </CardContainer>
        ))}
      </ScrollView>
    );
  }
}

const CardContainer = styled.TouchableOpacity`
  width: 160px;
  border-radius: 8px;
  background: #FFF;
  width: 320px;
  height: 160px;
  margin: 24px 16px;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const CardContainerWithoutFeedback = styled.View`
  background: #FFF;
  height: 160px;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(WalletList));
