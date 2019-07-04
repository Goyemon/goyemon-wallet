'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { RootContainer, Button, HeaderOne } from '../components/common';
import { connect } from 'react-redux';
import WalletController from '../wallet-core/WalletController.ts';
import { saveWeb3 } from '../actions/ActionWeb3';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from "../actions/ActionWallets";
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
    const checksumAddressWithoutPrefix = this.props.web3.utils.stripHexPrefix(this.props.checksumAddress);

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        register: "true",
        address: checksumAddressWithoutPrefix
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  render() {
    const mnemonic = this.props.mnemonic;
    const splitMnemonic = mnemonic.split(' ');

    return (
      <RootContainer>
        <View>
          <HeaderOne>
            Create Wallet
          </HeaderOne>
        </View>
        <Container>
          <MnemonicPhrasesContainer style={styles.table}>
            {splitMnemonic.map((splitMnemonic, id) => (
              <MnemonicWordWrapper style={styles.cell} key={id}><Text style={styles.text}>{splitMnemonic}</Text></MnemonicWordWrapper>
            ))}
          </MnemonicPhrasesContainer>
          <Text>Did you really keep it safe already?</Text>
          <Button
            text="Verify"
            textColor="white"
            backgroundColor="#4083FF"
            margin="24px auto"
            onPress={async () => {
              await this.savePrivateKey();
              await this.props.saveWeb3();
              await this.props.getChecksumAddress();
              await this.registerEthereumAddress();
              await this.props.getEthPrice();
              await this.props.getDaiPrice();
              this.props.navigation.navigate('Wallets');
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const styles = {
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cell: {
    flexBasis: '25%',
    flex: 1
  },
  text: {
    fontSize: 16,
    padding: 4,
    textAlign: 'center',
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicPhrasesContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 95%;
`;

const MnemonicWordWrapper = styled.View`
  background: #FFF;
  border-radius: 16px;
  border-color: #F8F8F8;
  border-width: 4px;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    mnemonic: state.ReducerMnemonic.mnemonic,
    web3: state.ReducerWeb3.web3,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

const mapDispatchToProps = {
  getChecksumAddress,
  saveWeb3,
  getEthPrice,
  getDaiPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonic);
