'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne, OneLiner } from '../components/common';
import { connect } from 'react-redux';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import EtherUtilities from '../utilities/EtherUtilities.js';
import ProviderUtilities from '../utilities/ProviderUtilities.ts';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class CreateWalletTutorial extends Component {
  async savePrivateKey() {
    const privateKey = await WalletUtilities.createPrivateKey();
    await WalletUtilities.setPrivateKey(privateKey);
  }

  render() {
    const mnemonicWords = this.props.mnemonicWords;

    return (
      <RootContainer>
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="24" marginLeft="0" marginTop="96">
          No Backup, No Money
        </OneLiner>
        <Container>
          <Text>
            Your backup words are the only way to restore your wallet if your phone is lost, stoken,
            broken or upgraded.
          </Text>
          <Text>
            We will show you a list of words to save in the next screen. We strongly recommend that
            you write them down on a piece of paper. Please keep it somewhere safe.
          </Text>
          <Button
            text="Write down backup words"
            textColor="white"
            backgroundColor="#009DC4"
            margin="24px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('ShowMnemonic')}
          />
          <Button
            text="Do This Later"
            textColor="#009DC4"
            backgroundColor="#F8F8F8"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await WalletUtilities.setMnemonic(mnemonicWords);
              await WalletUtilities.generateWallet(mnemonicWords);
              await this.savePrivateKey();
              await this.props.createChecksumAddress();
              await ProviderUtilities.registerEthereumAddress(this.props.checksumAddress);
              this.props.navigation.navigate('NotificationPermissionTutorial')
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
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

const mapDispatchToProps = {
  createChecksumAddress
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletTutorial);
