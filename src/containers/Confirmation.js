'use strict';
import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button } from '../components/common/';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ethTx from "ethereumjs-tx";
import WalletController from '../wallet-core/WalletController.ts';

class Confirmation extends Component {
  async sendSignedTx() {
    const transactionObject = await new ethTx(this.props.transactionObject);
    let privateKey = await WalletController.retrievePrivateKey();
    privateKey = await Buffer.from(privateKey, 'hex');
    await transactionObject.sign(privateKey);
    const serializedTransactionObject = await transactionObject.serialize();

    await this.props.web3.eth.sendSignedTransaction(`0x${serializedTransactionObject.toString('hex')}`,
      (error, result) => {
        if (error) { console.log(`Error: ${error}`); }
        else { console.log(`Result: ${result}`); }
      }
    );
  }

  render() {
    const gasPriceInEther = this.props.web3.utils.fromWei(this.props.transactionObject.gasPrice, 'Ether');
    const valueInEther = parseFloat(this.props.web3.utils.fromWei(this.props.transactionObject.value, 'Ether'));
    const gasPriceInEtherNumber = parseFloat(gasPriceInEther);
    const total = gasPriceInEtherNumber + valueInEther;

    return (
      <ScrollView>
        <CardContainerWithoutFeedback>
          <Text>From</Text>
          <Text>{this.props.checksumAddress}</Text>
        </CardContainerWithoutFeedback>
        <Text>↓</Text>
        <CardContainerWithoutFeedback>
          <Text>To</Text>
          <Text>{this.props.transactionObject.to}</Text>
        </CardContainerWithoutFeedback>
        <Text>Total {total} ETH</Text>
        <Text>Gas Fee {gasPriceInEther} ETH</Text>
        <ButtonContainer>
          <Button text="Back" textColor="white" backgroundColor="grey" onPress={() => this.props.navigation.navigate('Send')} />
          <Button text="Confirm" textColor="white" backgroundColor="#01d1e5" onPress={async () => {
            await this.props.navigation.navigate('Ethereum')
            await this.sendSignedTx()
          }} />
        </ButtonContainer>
      </ScrollView>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  width: 160px;
  border-radius: 8px;
  background: #FFF;
  width: 360px;
  height: 120px;
  margin: 24px 16px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

function mapStateToProps(state) {
  return {
    web3: state.ReducerWeb3.web3,
    transactionObject: state.ReducerTransactionObject.transactionObject,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Confirmation);
