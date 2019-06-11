'use strict';
import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button } from '../components/common/';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ethTx from "ethereumjs-tx";
import WalletController from '../wallet-core/WalletController.ts';
import { addNewTransaction } from '../actions/ActionTransactions';

class Confirmation extends Component {
  async sendSignedTx() {
    const transactionObject = new ethTx(this.props.transactionObject);
    let privateKey = await WalletController.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    transactionObject.sign(privateKey);
    const serializedTransactionObject = transactionObject.serialize();

    this.props.web3.eth.sendSignedTransaction(`0x${serializedTransactionObject.toString('hex')}`,
      (error, transactionHash) => {
        if (error) { console.log(`Error: ${error}`); }
        else {
          console.log(`Result: ${transactionHash}`);
          this.updateTransactionHistory(transactionHash);
        }
      }
    );
  }

  async updateTransactionHistory(transactionHash) {
    const transactionObject = await this.getTransactionObject(transactionHash)
    await this.props.addNewTransaction(transactionObject);
  }

  async getTransactionObject(transactionHash) {
    const transactionObject = await this.props.web3.eth.getTransaction(transactionHash);
    return transactionObject;
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
            this.props.navigation.navigate('Ethereum')
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

const mapDispatchToProps = {
  addNewTransaction
};

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
