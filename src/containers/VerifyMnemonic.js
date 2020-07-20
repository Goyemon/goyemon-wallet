'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
import { updateMnemonicWordsValidation } from '../actions/ActionMnemonicWordsValidation';
import {
  RootContainer,
  ProgressBar,
  HeaderTwo,
  Button,
  Description,
  ErrorMessage,
  Container,
  MnemonicWordButton,
  UntouchableCardContainer,
} from '../components/common';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class VerifyMnemonic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonicWords: [
        props.mnemonicWords.split(' ')[0],
        props.mnemonicWords.split(' ')[1],
        '',
        '',
        props.mnemonicWords.split(' ')[4],
        '',
        props.mnemonicWords.split(' ')[6],
        '',
        props.mnemonicWords.split(' ')[8],
        props.mnemonicWords.split(' ')[9],
        props.mnemonicWords.split(' ')[10],
        '',
        props.mnemonicWords.split(' ')[12],
        '',
        props.mnemonicWords.split(' ')[14],
        props.mnemonicWords.split(' ')[15],
        props.mnemonicWords.split(' ')[16],
        '',
        props.mnemonicWords.split(' ')[18],
        '',
        props.mnemonicWords.split(' ')[20],
        props.mnemonicWords.split(' ')[21],
        props.mnemonicWords.split(' ')[22],
        '',
      ],
      tapNumber: 2,
      button2: false,
      button19: false,
      button3: false,
      button17: false,
      button13: false,
      button23: false,
      button7: false,
      button5: false,
      button11: false,
      mnemonicWordsValidation: true,
    };
  }

  resetValidation() {
    const mnemonicWordsArray = this.props.mnemonicWords.split(' ');
    this.setState({
      mnemonicWords: [
        mnemonicWordsArray[0],
        mnemonicWordsArray[1],
        '',
        '',
        mnemonicWordsArray[4],
        '',
        mnemonicWordsArray[6],
        '',
        mnemonicWordsArray[8],
        mnemonicWordsArray[9],
        mnemonicWordsArray[10],
        '',
        mnemonicWordsArray[12],
        '',
        mnemonicWordsArray[14],
        mnemonicWordsArray[15],
        mnemonicWordsArray[16],
        '',
        mnemonicWordsArray[18],
        '',
        mnemonicWordsArray[20],
        mnemonicWordsArray[21],
        mnemonicWordsArray[22],
        '',
      ],
      tapNumber: 2,
      button2: false,
      button19: false,
      button3: false,
      button17: false,
      button13: false,
      button23: false,
      button7: false,
      button5: false,
      button11: false,
    });
  }

  updateMnemonicArray(index, word) {
    const mnemonicWordsCopy = this.state.mnemonicWords;
    mnemonicWordsCopy[index] = word;
    this.setState({ mnemonicWords: mnemonicWordsCopy });
  }

  isPrime(num) {
    for (var i = 2; i < Math.sqrt(num) + 1; ++i) {
      if (num % i === 0) {
        return false;
      }
    }

    return num !== 1;
  }

  getNextPrime(prime) {
    for (var count = prime + 1; ; ++count) {
      if (this.isPrime(count)) {
        break;
      }
    }

    return count;
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
    return (
      <ErrorMessage textAlign="center">invalid mnemonic words!</ErrorMessage>
    );
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
            tap the missing words in order
          </Description>
          <MnemonicWordsContainer style={styles.table}>
            {mnemonicWords.map((word, id) => (
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
                    value={mnemonicWords[id]}
                  />
                </MnemonicWordWrapper>
              </View>
            ))}
          </MnemonicWordsContainer>
          <UntouchableCardContainer
            alignItems="center"
            borderRadius="8px"
            flexDirection="column"
            height="200px"
            justifyContent="center"
            marginTop="0"
            textAlign="center"
            width="90%"
          >
            <Container
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              marginTop={0}
              width="100%"
            >
              <MnemonicWordButton
                disabled={this.state.button2}
                opacity={this.state.button2 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[2],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button2: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[2]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button19}
                opacity={this.state.button19 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[19],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button19: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[19]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button3}
                opacity={this.state.button3 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[3],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button3: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[3]}
              </MnemonicWordButton>
            </Container>
            <Container
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              marginTop={16}
              width="100%"
            >
              <MnemonicWordButton
                disabled={this.state.button17}
                opacity={this.state.button17 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[17],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button17: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[17]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button13}
                opacity={this.state.button13 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[13],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button13: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[13]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button23}
                opacity={this.state.button23 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[23],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button23: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[23]}
              </MnemonicWordButton>
            </Container>
            <Container
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              marginTop={16}
              width="100%"
            >
              <MnemonicWordButton
                disabled={this.state.button7}
                opacity={this.state.button7 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[7],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button7: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[7]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button5}
                opacity={this.state.button5 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[5],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button5: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[5]}
              </MnemonicWordButton>
              <MnemonicWordButton
                disabled={this.state.button11}
                opacity={this.state.button11 ? 0.1 : 1}
                onPress={() => {
                  this.updateMnemonicArray(
                    this.state.tapNumber,
                    this.props.mnemonicWords.split(' ')[11],
                  );
                  this.setState({
                    tapNumber: this.getNextPrime(this.state.tapNumber),
                    button11: true,
                  });
                }}
              >
                {this.props.mnemonicWords.split(' ')[11]}
              </MnemonicWordButton>
            </Container>
          </UntouchableCardContainer>
          <ButtonContainer>
            <Button
              text="Retry"
              textColor="#5F5F5F"
              backgroundColor="#f8f8f8"
              borderColor="#f8f8f8"
              margin="0 auto"
              marginBottom="4px"
              opacity="1"
              onPress={() => {
                this.resetValidation();
              }}
            />
            <Button
              text="Verify"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="0 auto"
              marginBottom="12px"
              opacity="1"
              onPress={async () => {
                await this.validateForm();
              }}
            />
            <View>{this.renderInvalidMnemonicWordsMessage()}</View>
          </ButtonContainer>
        </RootContainer>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  cell: {
    flexBasis: '25%',
    flex: 1,
    marginBottom: 8,
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
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

const ButtonContainer = styled.View`
  margin-bottom: 56;
  margin-top: 24;
`;

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords,
  };
}

const mapDispatchToProps = {
  updateMnemonicWordsValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMnemonic);
