'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import { Button } from '../components/common/Button';
import { connect } from "react-redux";
import Web3 from 'web3';

class Send extends Component {
  constructor(props) {
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/884958b4538343aaa814e3a32718ce91'));
  }
  render() {
    return (
      <View>
      <Text>To</Text>
      <Text>Amount</Text>
      <Text>Transaction Fee</Text>
        <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={() => this.props.navigation.navigate('Confirmation')} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  };
}

export default connect(mapStateToProps)(Send);
