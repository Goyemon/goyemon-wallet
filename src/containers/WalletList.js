'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, View, Text } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
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
      <RootContainer>
        <HeaderOne>Home</HeaderOne>
        <CardContainerWithoutFeedback>
          <HeaderTwo
            fontSize="24px"
           >
            Total Balance
          </HeaderTwo>
          <UsdBalance>${this.state.usdBalance}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderTwo
          fontSize="16px"
         >
          Currency
        </HeaderTwo>
        {wallets.map(wallet => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="120px"
            justifyContent="center"
            textAlign="left"
            width="95%"
            key={wallet.id}
            onPress={
              wallet.coin === 'Ether'
                ? () => navigation.navigate('Ethereum')
                : () => navigation.navigate('Dai')
            }
          >
            <WalletDetail key={wallet.id} wallet={wallet} />
          </TouchableCardContainer>
        ))}
        <View></View>
      </RootContainer>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  align-items: center;
  background: #FFF;
  height: 120px;
  margin-top: 24px;
  padding: 24px;
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
