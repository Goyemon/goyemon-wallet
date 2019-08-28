'use strict';
import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne } from '../components/common';
import WalletController from '../wallet-core/WalletController.ts';
import EthUtils from '../wallet-core/EthUtils';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from '../actions/ActionWallets';
import { getExistingTransactions } from '../actions/ActionTransactionHistory';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class Import extends Component {
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
  async componentDidMount() {
    this.messageListener = firebase.messaging().onMessage((downstreamMessage) => {
      if (downstreamMessage.data.type === "balance") {
        this.props.saveBalance(parseInt(downstreamMessage.data.balance));
      }
      if (downstreamMessage.data.type === "txhistory" && downstreamMessage.data.count != "0") {
        let transactions = JSON.parse(downstreamMessage.data.items);
        this.props.getExistingTransactions(transactions);
      }
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

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

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(" ");
    if (WalletController.validateMnemonic(mnemonicWords)) {
      this.setState({mnemonicWordsValidation: true});
      await WalletController.setMnemonic(mnemonicWords);
      await WalletController.generateWallet(mnemonicWords);
      await this.savePrivateKey();
      await this.props.getChecksumAddress();
      await this.registerEthereumAddress();
      await this.props.getEthPrice();
      await this.props.getDaiPrice();
      this.props.navigation.navigate('Wallets');
    } else {
      this.setState({mnemonicWordsValidation: false});
      console.log('form validation failed!');
    }
  }

  renderInvalidMnemonicWordsMessage() {
    if (this.state.mnemonicWordsValidation) {
      return ;
    } else {
      return <ErrorMessage>invalid mnemonic words!</ErrorMessage>
    }
  }

  handleTextChange = (text, id) => {
    const mnemonicWords = this.state.mnemonicWords;
    mnemonicWords[id] = text;

    this.setState({ mnemonicWords });
  };

  render() {
    return (
      <RootContainer>
        <HeaderOne>Import Wallet</HeaderOne>
        <HeaderOne marginTop="48">Import Wallet</HeaderOne>
        <Container>
          <Text>Enter the backup words for the wallet you want to import</Text>
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
          <ButtonContainer>
            <Button
              text="go"
              textColor="white"
              backgroundColor="#4083FF"
              margin="24px auto"
              opacity="1"
              onPress={async () => {
                await this.validateForm();
              }}
            />
          </ButtonContainer>
          <View>
            {this.renderInvalidMnemonicWordsMessage()}
          </View>
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
    flex: 1,
    marginBottom: 8
  }
};

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

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const ErrorMessage = styled.Text`
  color: red;
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
  getExistingTransactions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Import);
