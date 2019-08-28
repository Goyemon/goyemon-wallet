'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, View, Text } from 'react-native';
import { RootContainer, TouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common';
import WalletDetail from '../containers/WalletDetail';
import styled from 'styled-components';
import HomeStack from '../navigators/HomeStack';

class WalletList extends Component {
  componentWillMount() {
    HomeStack.navigationOptions = ({ navigation }) => {
      let tabBarVisible = true;
      return tabBarVisible;
    };
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
    const { wallets, balance, navigation } = this.props;

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Home</HeaderOne>
        <CardContainerWithoutFeedback>
          <HeaderTwo
            fontSize="24px"
            marginBottom="8"
            marginTop="0"
           >
            Total Balance
          </HeaderTwo>
          <UsdBalance>${this.getUsdBalance(balance)}</UsdBalance>
        </CardContainerWithoutFeedback>
        <HeaderTwo
          fontSize="16px"
          marginBottom="8"
          marginTop="8"
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
    balance: state.ReducerBalance.balance
  }
}

export default withNavigation(connect(mapStateToProps)(WalletList));
