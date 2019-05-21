'use strict';
import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button } from './common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveTransactionObject } from '../actions/ActionTransactionObject';

class Send extends Component {
  constructor(props) {
    super();
    this.state = {
      balanceInEther: '0.0',
      gasPriceInGwei: ['0', '0', '0'],
      gasPriceInWei: ['0', '0', '0'],
      gasPrice: [
        {
          speed: "Fast",
          imagePath: require("../../assets/cheetah.png"),
          gasPriceInEther: "0",
        },
        {
          speed: "Average",
          imagePath: require("../../assets/dog.png"),
          gasPriceInEther: "0",
        },
        {
          speed: "Slow",
          imagePath: require("../../assets/snail.png"),
          gasPriceInEther: "0",
        }
      ],
      checked: 0,
      toAddress: '',
      amount: '0',
      transactionNonce: '0'
    };
    this.validateForm = this.validateForm.bind(this);
    this.transactionObject = {};
  }

  async componentDidMount() {
    const balanceInWei = await this.getBalance(this.props.checksumAddress);
    const balanceInEther = await this.props.web3.utils.fromWei(balanceInWei, 'ether');
    await this.setState({ balanceInEther: balanceInEther });
  }

  async getBalance(address) {
    try {
      const balanceInWei = await this.props.web3.eth.getBalance(address);
      return balanceInWei;
    } catch (err) {
      console.error(err);
    }
  }

  async constructTransactionObject() {
    this.state.transactionNonce = await this.props.web3.eth.getTransactionCount(
      this.props.checksumAddress
    );
    const gasPriceInWei = await parseFloat(
      this.props.web3.utils.toWei(this.state.gasPriceInGwei[this.state.checked], 'Gwei')
    );
    const amountInWei = await parseFloat(this.props.web3.utils.toWei(this.state.amount, 'Ether'));
    const transactionObject = await {
      nonce: `0x${this.state.transactionNonce.toString(16)}`,
      to: this.state.toAddress.toString(16),
      value: `0x${amountInWei.toString(16)}`,
      gasPrice: `0x${gasPriceInWei.toString(16)}`,
      gasLimit: `0x${parseFloat(21000).toString(16)}`,
      chainId: 3
    };
    return transactionObject;
  }

  validateToAddress() {
    if (this.props.web3.utils.isAddress(this.state.toAddress)) {
      console.log('address validated!');
      return true;
    }
      console.log('invalid address');
      return false;
  }

  validateAmount() {
    if (
      parseFloat(this.state.amount) + parseFloat(this.state.gasPrice[this.state.checked].gasPriceInEther) <
      parseFloat(this.state.balanceInEther)
    ) {
      console.log('amount validated!');
      return true;
    }
      console.log('insufficient balance!');
      return false;
  }

  async validateForm() {
    if (this.validateToAddress() && this.validateAmount()) {
      await this.props.saveTransactionObject(this.transactionObject);
      await this.props.navigation.navigate('Confirmation');
    } else {
      console.log('form validation failed!');
    }
  }

  render() {
    this.state.gasPriceInGwei[0] = this.props.gasPrice.data.fast.toString();
    this.state.gasPriceInGwei[1] = this.props.gasPrice.data.average.toString();
    this.state.gasPriceInGwei[2] = this.props.gasPrice.data.safeLow.toString();

    this.state.gasPriceInWei[0] = this.props.web3.utils.toWei(this.state.gasPriceInGwei[0], 'Gwei');
    this.state.gasPriceInWei[1] = this.props.web3.utils.toWei(this.state.gasPriceInGwei[1], 'Gwei');
    this.state.gasPriceInWei[2] = this.props.web3.utils.toWei(this.state.gasPriceInGwei[2], 'Gwei');

    this.state.gasPrice[0].gasPriceInEther = this.props.web3.utils.fromWei(
      this.state.gasPriceInWei[0],
      'Ether'
    );
    this.state.gasPrice[1].gasPriceInEther = this.props.web3.utils.fromWei(
      this.state.gasPriceInWei[1],
      'Ether'
    );
    this.state.gasPrice[2].gasPriceInEther = this.props.web3.utils.fromWei(
      this.state.gasPriceInWei[2],
      'Ether'
    );

    (async () => {
      this.transactionObject = await this.constructTransactionObject();
    })();

    return (
      <ScrollView>
        <CardContainerWithoutFeedback>
          <Text>To</Text>
          <TextInput
            placeholder="type an address you send your ether to"
            onChangeText={toAddress => this.setState({ toAddress })}
          />
        </CardContainerWithoutFeedback>
        <CardContainerWithoutFeedback>
          <Text>Amount(ETH)</Text>
          <TextInput
            placeholder="type the amount of ether you would like to send"
            onChangeText={amount => this.setState({ amount })}
          />
        </CardContainerWithoutFeedback>
        <CardContainerWithoutFeedback>
          <Text>Transaction Fee</Text>
          <TransactionFeeContainer>
            {this.state.gasPrice.map((gasPrice, key) => (
              <View key={key}>
                {this.state.checked === key ? (
                  <TouchableOpacity>
                    <Text>{gasPrice.speed}</Text>
                    <Image source={gasPrice.imagePath} />
                    <SelectedButton>{gasPrice.gasPriceInEther} ETH</SelectedButton>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ checked: key });
                    }}
                  >
                    <Text>{gasPrice.speed}</Text>
                    <Image source={gasPrice.imagePath} />
                    <UnselectedButton>{gasPrice.gasPriceInEther} ETH</UnselectedButton>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </TransactionFeeContainer>
        </CardContainerWithoutFeedback>
        <ButtonWrapper>
          <Button
            text="Send"
            textColor="white"
            backgroundColor="#01d1e5"
            onPress={async () => {
              await this.validateForm();
            }}
          />
        </ButtonWrapper>
      </ScrollView>
    );
  }
}

const SelectedButton = styled.Text`
  font-weight: 800;
`;

const UnselectedButton = styled.Text`
  font-weight: 400;
`;

const CardContainerWithoutFeedback = styled.View`
  width: 160px;
  border-radius: 8px;
  background: #fff;
  width: 360px;
  height: 200px;
  margin: 24px 16px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const TransactionFeeContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const ButtonWrapper = styled.View`
  alignItems: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    gasPrice: state.ReducerGasPrice.gasPrice,
    web3: state.ReducerWeb3.web3
  };
}

const mapDispatchToProps = {
  saveTransactionObject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send);
