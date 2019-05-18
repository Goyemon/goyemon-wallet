'use strict';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Header } from './common';
import { Button } from '../components/common/Button';
import { connect } from "react-redux";
import Web3 from 'web3';
import styled from 'styled-components/native';
import { saveTransactionObject } from "../actions/ActionTransactionObject";

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
        <Text>To</Text>
        <TextInput placeholder="address" onChangeText={(toAddress) => this.setState({toAddress})} />
        <Text>Amount(ETH)</Text>
        <TextInput placeholder="0" onChangeText={(amount) => this.setState({amount})} />
        <Text>Transaction Fee</Text>
        {
          this.state.gasPriceInGwei.map((gasPriceInGwei, key) => {
            return(
              <View>
                {this.state.checked === key ?
                  <TouchableOpacity>
                    <SelectedButton>{gasPriceInGwei}</SelectedButton>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => {this.setState({checked: key})}}>
                    <UnselectedButton>{gasPriceInGwei}</UnselectedButton>
                  </TouchableOpacity>
                }
              </View>
            )
          })
        }
      </View>
    );
  }
}

const SelectedButton = styled.Text`
  font-weight: 800;
`;

const UnselectedButton = styled.Text`
  font-weight: 400;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice
  };
}

const mapDispatchToProps = {
    saveTransactionObject
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
