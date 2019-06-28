'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { RootContainer, Button, UntouchableCardContainer, HeaderOne, HeaderTwo } from '../components/common/';
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
      <RootContainer>
        <HeaderOne>Confirmation</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          flexDirection="column"
          height="160px"
          justifyContent="flex-start"
          textAlign="left"
          width="95%"
         >
          <HeaderTwo
          fontSize="16px"
          >
            from
          </HeaderTwo>
          <Text>{this.props.checksumAddress}</Text>
        <Text>↓</Text>
          <HeaderTwo
          fontSize="16px"
          >
           to
          </HeaderTwo>
          <Text>{this.props.transactionObject.to}</Text>
        </UntouchableCardContainer>
        <Text>Total {total} ETH</Text>
        <Text>Gas Fee {gasPriceInEther} ETH</Text>
        <ButtonContainer>
          <Button text="Back" textColor="white" backgroundColor="#EEE"  margin="8px" onPress={() => this.props.navigation.navigate('Send')} />
          <Button text="Confirm" textColor="white" backgroundColor="#4083FF"  margin="8px" onPress={async () => {
            this.props.navigation.navigate('Ethereum')
            await this.sendSignedTx()
          }} />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
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
