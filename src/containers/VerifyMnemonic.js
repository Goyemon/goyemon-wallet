'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { RootContainer, ProgressBar, HeaderTwo, Button, Description } from '../components/common';
import { connect } from 'react-redux';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import EtherUtilities from '../utilities/EtherUtilities.js';
import ProviderUtilities from '../utilities/ProviderUtilities.ts';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class VerifyMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicWords: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      mnemonicWordsValidation: true
    };
  }

  async savePrivateKey() {
    const privateKey = await WalletUtilities.createPrivateKey();
    await WalletUtilities.setPrivateKey(privateKey);
  }

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(' ');

    if (
      WalletUtilities.validateMnemonic(mnemonicWords) &&
      mnemonicWords === this.props.mnemonicWords
    ) {
      this.setState({ mnemonicWordsValidation: true });
      await WalletUtilities.setMnemonic(mnemonicWords);
      await WalletUtilities.generateWallet(mnemonicWords);
      await this.savePrivateKey();
      await this.props.createChecksumAddress();
      await ProviderUtilities.registerEthereumAddress(this.props.checksumAddress);
      this.props.navigation.navigate('NotificationPermissionTutorial');
    } else {
      this.setState({ mnemonicWordsValidation: false });
      console.log('form validation failed!');
    }
  }

  renderInvalidMnemonicWordsMessage() {
    if (this.state.mnemonicWordsValidation) {
      return;
    }
      return <ErrorMessage>invalid mnemonic words!</ErrorMessage>;
  }

  handleTextChange = (text, id) => {
    const mnemonicWords = this.state.mnemonicWords;
    mnemonicWords[id] = text;

    this.setState({ mnemonicWords });
  };

  render() {
    const { mnemonicWords } = this.state;

    return (
      <RootContainer>
        <ProgressBar oneColor="#5f5f5f" twoColor="#5f5f5f" threeColor="#eeeeee" marginRight="40%" width="40%" />
        <Container>
          <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
            Verify Backup Words
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            Please write down a list of words again.
          </Description>
          <MnemonicWordsContainer style={styles.table}>
            {this.state.mnemonicWords.map((word, id) => (
              <View style={styles.cell} key={id}>
                <MnemonicWordWrapper>
                  <TextInput
                    style={{ textAlign: 'center', padding: 4 }}
                    placeholder={(id + 1).toString()}
                    autoCapitalize="none"
                    maxLength={15}
                    onChangeText={text => {
                      this.handleTextChange(text, id);
                    }}
                  />
                </MnemonicWordWrapper>
              </View>
            ))}
          </MnemonicWordsContainer>
          <View>{this.renderInvalidMnemonicWordsMessage()}</View>
          <Button
            text="Verify"
            textColor="#009DC4"
            backgroundColor="#FFF"
            borderColor="#009DC4"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await this.validateForm();
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const styles = StyleSheet.create({
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cell: {
    flexBasis: '25%',
    flex: 1,
    marginBottom: 8
  }
});

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicWordsContainer = styled.View`
  margin-bottom: 24px;
  margin-top: 24px;
  width: 95%;
`;

const MnemonicWordWrapper = styled.View`
  background: #fff;
  border-color: #f8f8f8;
  border-radius: 16px;
  border-width: 4px;
  text-align: center;
`;

const ErrorMessage = styled.Text`
  color: #ff3346;
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
)(VerifyMnemonic);
