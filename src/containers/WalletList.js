'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import Web3 from 'web3';
import {
  RootContainer,
  UntouchableCardContainer,
  TouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletDetail from '../containers/WalletDetail';

class WalletList extends Component {
  async componentDidMount() {
    await FcmPermissions.checkFcmPermissions();
  }

  render() {
    const { currencies, balance, navigation } = this.props;

    let ethBalance = Web3.utils.fromWei(balance.weiBalance);
    ethBalance = RoundDownBigNumber(ethBalance).toFixed(4);

    const daiBalance = RoundDownBigNumber(balance.daiBalance)
      .div(new RoundDownBigNumber(10).pow(18))
      .toString();

    let truncatedAdderss;
    if (this.props.checksumAddress) {
      truncatedAdderss = this.props.checksumAddress.substring(0, 24) + '...';
    }

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Wallets</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">total wallet balance</HeaderFour>
          <UsdBalance>
            ${PriceUtilities.getTotalWalletBalance(ethBalance, daiBalance)}
          </UsdBalance>
          <AddressContainer
            onPress={() => {
              this.props.navigation.navigate('Receive');
            }}
          >
            <Icon name="qrcode" size={20} color="#5f5f5f" />
            <Address>{truncatedAdderss}</Address>
          </AddressContainer>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="16"
          marginLeft="16"
          marginTop="16"
        >
          YOUR ACCOUNTS
        </HeaderThree>
        {currencies.map(currency => (
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="flex-start"
            textAlign="left"
            width="90%"
            key={currency.id}
            onPress={
              currency.name === 'Ether'
                ? () => navigation.navigate('SendEth')
                : () => navigation.navigate('SendDai')
            } 
          >
            <WalletDetail key={currency.id} currency={currency} />
          </TouchableCardContainer>
        ))}
      </RootContainer>
    );
  }
}

const UsdBalance = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const Address = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 12;
  margin-left: 8;
`;

const AddressContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 12px auto;
  width: 80%;
`;

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  currencies: state.ReducerCurrencies.currencies,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(WalletList));
