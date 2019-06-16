'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';

class WalletList extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: "0.0",
      usdBalance: "0.0"
    };
  }

  async componentDidMount() {
    const newBalanceInWei = await this.getBalance(this.props.checksumAddress);
    const newBalanceInEther = this.props.web3.utils.fromWei(newBalanceInWei);
    this.setState({balance: newBalanceInEther});
    this.setState({usdBalance: this.getUsdBalance(newBalanceInEther)});
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch(err) {
      console.error(err);
    }
  }

  getUsdBalance(ethBalance) {
    try {
      const usdPrice = this.props.wallets[0].price;
      const parsedEthBalance = parseFloat(ethBalance);
      const usdBalance = usdPrice * parsedEthBalance;
      const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedUsdBalance;
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
          <BalanceTitle>TOTAL BALANCE</BalanceTitle>
          <UsdBalance>{this.state.usdBalance} USD</UsdBalance>
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
  height: 120px;
  margin: 24px 16px;
  flexDirection: column;
  justifyContent: center;
  alignItems: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const CardContainerWithoutFeedback = styled.View`
  background: #FFF;
  height: 120px;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const BalanceTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const mapStateToProps = state => {
  return {
    wallets: state.ReducerWallets.wallets,
    web3: state.ReducerWeb3.web3,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  }
}

export default withNavigation(connect(mapStateToProps)(WalletList));
