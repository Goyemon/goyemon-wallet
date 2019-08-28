'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { RootContainer, Button, HeaderOne } from '../components/common';
import { connect } from 'react-redux';
import WalletController from '../wallet-core/WalletController.ts';
import MnemonicWords from './MnemonicWords';
import EthUtils from '../wallet-core/EthUtils.js';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from '../actions/ActionWallets';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class VerifyMnemonic extends Component {
  async savePrivateKey() {
    const privateKey = await WalletController.createPrivateKey();
    await WalletController.setPrivateKey(privateKey);
  }

  async registerEthereumAddress() {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const checksumAddressWithoutPrefix = EthUtils.stripHexPrefix(this.props.checksumAddress);

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        register: 'true',
        address: checksumAddressWithoutPrefix
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          text="2"
          width="67%"
        />
        <View>
          <HeaderOne marginTop="48">Create Wallet</HeaderOne>
        </View>
        <Container>
          <MnemonicWords />
          <Text>Did you really keep it safe already?</Text>
          <Button
            text="Verify"
            textColor="white"
            backgroundColor="#4083FF"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await this.savePrivateKey();
              await this.props.getChecksumAddress();
              await this.registerEthereumAddress();
              await this.props.getEthPrice();
              await this.props.getDaiPrice();
              this.props.navigation.navigate('NotificationPermissionTutorial');
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

function mapStateToProps(state) {
  return {
    web3: state.ReducerWeb3.web3,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

const mapDispatchToProps = {
  getChecksumAddress,
  getEthPrice,
  getDaiPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonic);
