'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Platform, View, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { saveMnemonicWords } from '../actions/ActionMnemonic';
import { updateMnemonicWordsValidation } from '../actions/ActionMnemonicWordsValidation';
import { RootContainer, ProgressBar, HeaderTwo, Button, Description } from '../components/common';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class ImportTwentyFourMnemonicWords extends Component {
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
    if (WalletUtilities.validateMnemonic(mnemonicWords)) {
      this.setState({ mnemonicWordsValidation: true });
      this.props.updateMnemonicWordsValidation(true);
      await WalletUtilities.setMnemonic(mnemonicWords);
      await this.props.saveMnemonicWords();
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

  focusNextInput(nextInput) {
    this.refs[nextInput].focus();
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.avoidKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
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
              Import Backup Words
            </HeaderTwo>
            <Description marginBottom="8" marginLeft="8" marginTop="16">
              Enter the backup words to import your wallet.
            </Description>
            <MnemonicWordsContainer style={styles.table}>
              {this.state.mnemonicWords.map((word, id) => (
                <View style={styles.cell} key={id}>
                  <MnemonicWordWrapper>
                    <TextInput
                      ref={id}
                      style={{ textAlign: 'center', padding: 4 }}
                      placeholder={(id + 1).toString()}
                      autoCapitalize="none"
                      maxLength={15}
                      onChangeText={text => {
                        this.handleTextChange(text, id);
                      }}
                      onSubmitEditing={id === 23 ? console.log('done') : () => this.focusNextInput((id + 1).toString())}
                      returnKeyType={id === 23 ? 'done' : 'next'}
                    />
                  </MnemonicWordWrapper>
                </View>
              ))}
            </MnemonicWordsContainer>
            <ButtonContainer>
              <Button
                text="Next"
                textColor="#00A3E2"
                backgroundColor="#FFF"
                borderColor="#00A3E2"
                margin="24px auto"
                opacity="1"
                onPress={async () => {
                  await this.validateForm();
                }}
              />
            </ButtonContainer>
            <View>{this.renderInvalidMnemonicWordsMessage()}</View>
          </Container>
        </RootContainer>
      </KeyboardAvoidingView>
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
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const MnemonicWordsContainer = styled.View`
  margin-bottom: 24;
  margin-top: 24;
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
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

const mapDispatchToProps = {
  saveMnemonicWords,
  updateMnemonicWordsValidation
};

export default connect(
  null,
  mapDispatchToProps
)(ImportTwentyFourMnemonicWords);
