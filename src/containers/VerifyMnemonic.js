'use strict';
import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from '../components/common';
import { connect } from 'react-redux';
import WalletController from '../wallet-core/WalletController.ts';
import { saveWeb3 } from '../actions/ActionWeb3';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';
import styled from 'styled-components/native';

class VerifyMnemonic extends Component {
  async savePrivateKey() {
    const privateKey = await WalletController.createPrivateKey();
    await WalletController.setPrivateKey(privateKey);
  }

  render() {
    const mnemonic = this.props.mnemonic;
    const splitMnemonic = mnemonic.split(' ');

    return (
      <View style={styles.textStyle}>
        <MnemonicPhrasesContainer>
          {splitMnemonic.map((splitMnemonic, id) => (
            <MnemonicWord key={id}>{splitMnemonic} </MnemonicWord>
          ))}
        </MnemonicPhrasesContainer>
        <Text>Did you really keep it safe already?</Text>
        <Text>Do you swear for your mom?</Text>
        <Button
          text="Verify"
          textColor="white"
          backgroundColor="#01d1e5"
          onPress={async () => {
            await this.savePrivateKey();
            await this.props.saveWeb3();
            await this.props.getChecksumAddress();
            this.props.navigation.navigate('Wallets');
          }}
        />
      </View>
    );
  }
}

const styles = {
  textStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const MnemonicPhrasesContainer = styled.Text`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  margin: 16px;
`;

const MnemonicWord = styled.Text`
  border-radius: 8px;
  border-color: #EEE
  font-size: 16px;
  margin: 4px;
`;

function mapStateToProps(state) {
  return {
    mnemonic: state.ReducerMnemonic.mnemonic
  };
}

const mapDispatchToProps = {
  getChecksumAddress,
  saveWeb3
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonic);
