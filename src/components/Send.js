'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import { Button } from '../components/common/Button';
import { connect } from "react-redux";
import Web3 from 'web3';

class Send extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gasPriceInGwei: [0, 0, 0],
      checked: 0,
      toAddress: "",
      amount: 0,
      transactionNonce: 0
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/884958b4538343aaa814e3a32718ce91'));
    this.getTransactionNonce = this.getTransactionNonce.bind(this);
  }
  async getTransactionNonce() {
    this.state.transactionNonce = await this.web3.eth.getTransactionCount(this.props.checksumAddress);
  }

  render() {
    this.state.gasPriceInGwei[0] = this.props.gasPrice.data.fast;
    this.state.gasPriceInGwei[1] = this.props.gasPrice.data.average;
    this.state.gasPriceInGwei[2] = this.props.gasPrice.data.safeLow;
    return (
      <View>
      <Text>Transaction Fee</Text>
        <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={() => this.props.navigation.navigate('Confirmation')} />
        <Text>To</Text>
        <TextInput placeholder="address" onChangeText={(toAddress) => this.setState({toAddress})} />
        <Text>Amount(ETH)</Text>
        <TextInput placeholder="0" onChangeText={(amount) => this.setState({amount})} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice
  };
}

export default connect(mapStateToProps)(Send);
