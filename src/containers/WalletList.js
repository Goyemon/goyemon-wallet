'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import WalletDetail from '../containers/WalletDetail';

const WalletList = ({ wallets, navigation }) => {
  const { textStyle } = styles;
  return (
    <ScrollView style={textStyle}>
      <View><Text>Balance</Text></View>
      {wallets.map(wallet => (
        <TouchableOpacity
          key={wallet.id}
          onPress={
            wallet.coin === 'Ether'
              ? () => navigation.navigate('Ethereum')
              : () => navigation.navigate('Dai')
          }
        >
          <WalletDetail key={wallet.id} wallet={wallet} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = {
  textStyle: {
    backgroundColor: '#FFF'
  }
};

const mapStateToProps = state => {
  return { wallets: state.ReducerWallets.wallets }
}

export default withNavigation(connect(mapStateToProps)(WalletList));
