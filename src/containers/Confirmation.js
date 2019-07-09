'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  HeaderTwo
} from '../components/common/';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ethTx from 'ethereumjs-tx';
import WalletController from '../wallet-core/WalletController.ts';
import { addNewTransaction } from '../actions/ActionTransactionHistory';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class Confirmation extends Component {
  async constructSignedOutgoingTransactionObject() {
    const outgoingTransactionObject = new ethTx(this.props.outgoingTransactionObject);
    let privateKey = await WalletController.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    outgoingTransactionObject.sign(privateKey);
    let signedTransaction = outgoingTransactionObject.serialize();
    signedTransaction = `0x${signedTransaction.toString('hex')}`;
    return signedTransaction;
  }

  async sendSignedTx() {
    await this.sendOutgoingTransactionToServer();
    await this.props.addNewTransaction(this.props.outgoingTransactionObject);
  }

  async sendOutgoingTransactionToServer() {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const signedTransaction = await this.constructSignedTransactionObject();

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        signedTransaction
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  render() {
    const gasPriceInEther = this.props.web3.utils.fromWei(
      this.props.outgoingTransactionObject.gasPrice,
      'Ether'
    );
    const valueInEther = parseFloat(
      this.props.web3.utils.fromWei(this.props.outgoingTransactionObject.value, 'Ether')
    );
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
          <HeaderTwo fontSize="16px">from</HeaderTwo>
          <Text>{this.props.checksumAddress}</Text>
          <Text>↓</Text>
          <HeaderTwo fontSize="16px">to</HeaderTwo>
          <Text>{this.props.outgoingTransactionObject.to}</Text>
        </UntouchableCardContainer>
        <Text>Total {total} ETH</Text>
        <Text>Gas Fee {gasPriceInEther} ETH</Text>
        <ButtonContainer>
          <Button
            text="Back"
            textColor="white"
            backgroundColor="#EEE"
            margin="8px"
            onPress={() => this.props.navigation.navigate('Send')}
          />
          <Button
            text="Confirm"
            textColor="white"
            backgroundColor="#4083FF"
            margin="8px"
            onPress={async () => {
              this.props.navigation.navigate('Ethereum');
              await this.sendSignedTx();
            }}
          />
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
    outgoingTransactionObject: state.ReducerOutgoingTransactionObject.outgoingTransactionObject,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

const mapDispatchToProps = {
  addNewTransaction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation);
