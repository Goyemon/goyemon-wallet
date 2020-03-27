'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import WalletDetail from '../containers/WalletDetail';

class WalletList extends Component {
  async componentDidMount() {
    await FcmPermissions.checkFcmPermissions();
  }

  render() {
    const { currencies, navigation } = this.props;

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Send</HeaderOne>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={16}
          width="100%"
        >
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
        </Container>
      </RootContainer>
    );
  }
}

const mapStateToProps = state => ({
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  currencies: state.ReducerCurrencies.currencies,
  balance: state.ReducerBalance.balance
});

export default withNavigation(connect(mapStateToProps)(WalletList));
