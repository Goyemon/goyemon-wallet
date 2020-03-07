'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { updateMnemonicWordsValidation } from '../actions/ActionMnemonicWordsValidation';
import { RootContainer, ProgressBar, HeaderTwo, Button, Description, ErrorMessage } from '../components/common';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class VerifyMnemonic extends Component {
  constructor(props) {
    super(props);
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
      this.props.updateMnemonicWordsValidation(true);
      if (Platform.OS === 'ios') {
        this.props.navigation.navigate('NotificationPermissionTutorial');
      } else if (Platform.OS === 'android') {
        this.props.navigation.navigate('WalletCreation');
      }
    } else {
      this.setState({ mnemonicWordsValidation: false });
      LogUtilities.logInfo('form validation failed!');
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
    const { mnemonicWords } = this.state;

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
            <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
              Verify Backup Words
            </HeaderTwo>
            <Description marginBottom="8" marginLeft="8" marginTop="16">
              type in your backup words in order
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
                      onSubmitEditing={
                        id === 23
                          ? LogUtilities.logInfo('done')
                          : () => this.focusNextInput((id + 1).toString())
                      }
                      returnKeyType={id === 23 ? 'done' : 'next'}
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
              marginBottom="12px"
              opacity="1"
              onPress={async () => {
                await this.validateForm();
              }}
            />
        </RootContainer>
      </KeyboardAvoidingView>
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
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

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

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

const mapDispatchToProps = {
  updateMnemonicWordsValidation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonic);
