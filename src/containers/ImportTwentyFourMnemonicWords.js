'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Platform, View, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { saveMnemonicWords } from '../actions/ActionMnemonic';
import { updateMnemonicWordsValidation } from '../actions/ActionMnemonicWordsValidation';
import {
  RootContainer,
  ProgressBar,
  HeaderTwo,
  Button,
  Description,
  ErrorMessage,
  Loader
} from '../components/common';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class ImportTwentyFourMnemonicWords extends Component {
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
      mnemonicWordsValidation: true,
      loading: false
    };
  }

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(' ');
    if (WalletUtilities.validateMnemonic(mnemonicWords)) {
      this.setState({ loading: true });
      this.setState({ mnemonicWordsValidation: true });
      this.props.updateMnemonicWordsValidation(true);
      await WalletUtilities.setMnemonic(mnemonicWords);
      await this.props.saveMnemonicWords();
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
            {I18n.t('import-title')}
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            {I18n.t('import-description')}
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
                    onChangeText={(text) => {
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
          <ButtonContainer>
            <Button
              text={I18n.t('button-next')}
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="24px auto"
              marginBottom="12px"
              opacity="1"
              onPress={async () => {
                await this.validateForm();
                this.setState({ loading: false });
              }}
            />
            <Loader animating={this.state.loading} size="small" />
          </ButtonContainer>
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
  justify-content: center;
`;

const mapDispatchToProps = {
  saveMnemonicWords,
  updateMnemonicWordsValidation
};

export default connect(null, mapDispatchToProps)(ImportTwentyFourMnemonicWords);
