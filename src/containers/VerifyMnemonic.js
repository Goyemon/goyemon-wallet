'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { RootContainer, ProgressBar, HeaderTwo, Button, Description } from '../components/common';
import { connect } from 'react-redux';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import styled from 'styled-components/native';

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

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(' ');

    if (
      WalletUtilities.validateMnemonic(mnemonicWords) &&
      mnemonicWords === this.props.mnemonicWords
    ) {
      this.setState({ mnemonicWordsValidation: true });
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
    mnemonicWords[id] = text.trim().toLowerCase();

    this.setState({ mnemonicWords });
  };

  render() {
    const { mnemonicWords } = this.state;

    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor="#FDC800"
          threeColor="#eeeeee"
          marginRight="40%"
          width="40%"
        />
        <Container>
          <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
            Verify Backup Words
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            Let us help you to protect your assets. Please type in your backup words to make sure
            they are right!
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
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
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
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

export default connect(mapStateToProps)(VerifyMnemonic);
