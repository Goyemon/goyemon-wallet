'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Text } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';

class WalletList extends Component {
  async componentDidMount() {
    await this.props.getEthPrice();
    await this.props.getDaiPrice();

  }
  }

  getUsdBalance(ethBalance) {
    try {
      const usdPrice = this.props.price.ethPrice;
      const parsedEthBalance = parseFloat(ethBalance);
      const usdBalance = usdPrice * parsedEthBalance;
      const roundedUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedUsdBalance;
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const { wallets, balance, navigation } = this.props;

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Home</HeaderOne>
        <CardContainerWithoutFeedback>
          <HeaderTwo
            color="#5F5F5F"
            fontSize="24px"
            marginBottom="8"
            marginLeft="0"
            marginTop="0"
           >
            Total Balance
          </HeaderTwo>
          <UsdBalance>${this.getUsdBalance(balance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderTwo
          color="#000"
          fontSize="16px"
          marginBottom="16"
          marginLeft="16"
          marginTop="16"
         >
          YOUR ACCOUNTS
        </HeaderTwo>
        {wallets.map(wallet => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="flex-start"
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
    price: state.ReducerPrice.price,
    web3: state.ReducerWeb3.web3,
    balance: state.ReducerBalance.balance
  }
}

const mapDispatchToProps = {
  getEthPrice,
  getDaiPrice
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(WalletList));
