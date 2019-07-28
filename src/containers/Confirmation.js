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
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class Confirmation extends Component {
  async constructSignedOutgoingTransactionObject() {
    let outgoingTransactionObject = this.props.outgoingTransactionObjects[this.props.outgoingTransactionObjects.length - 1];
    outgoingTransactionObject = new ethTx(outgoingTransactionObject);
    let privateKey = await WalletController.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    outgoingTransactionObject.sign(privateKey);
    let signedTransaction = outgoingTransactionObject.serialize();
    signedTransaction = `0x${signedTransaction.toString('hex')}`;
    return signedTransaction;
  }

  async sendSignedTx() {
    await this.sendOutgoingTransactionToServer();
  }

  async sendOutgoingTransactionToServer() {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const signedTransaction = await this.constructSignedOutgoingTransactionObject();

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        signedTransaction
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  render() {
    const gasPriceInEther = web3.utils.fromWei(
      outgoingTransactionObjects[outgoingTransactionObjects.length - 1].gasPrice,
      'Ether'
    );
    const valueInEther = parseFloat(
      web3.utils.fromWei(outgoingTransactionObjects[outgoingTransactionObjects.length - 1].value, 'Ether')
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
          <HeaderTwo fontSize="16px" marginBottom="8" marginTop="4">from</HeaderTwo>
          <Text>{checksumAddress}</Text>
          <Text>↓</Text>
          <HeaderTwo fontSize="16px" marginBottom="8" marginTop="4">to</HeaderTwo>
          <Text>{outgoingTransactionObjects[outgoingTransactionObjects.length - 1].to}</Text>
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
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObject.outgoingTransactionObjects,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation);
