'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import WalletList from '../containers/WalletList';

export default class Wallets extends Component {
  render() {
    return (
      <View>
        <WalletList />
      </View>
    );
  }
}
