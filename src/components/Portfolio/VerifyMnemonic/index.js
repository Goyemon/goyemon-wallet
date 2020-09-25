"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TextInput
} from "react-native";
import styled from "styled-components/native";
import { updateMnemonicWordsValidation } from "../../../actions/ActionMnemonicWordsValidation";
import {
  RootContainer,
  ProgressBar,
  HeaderTwo,
  Button,
  Description,
  ErrorMessage,
  Container,
  MnemonicWordButton,
  UntouchableCardContainer
} from "../../common";
import LogUtilities from "../../../utilities/LogUtilities";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";

class VerifyMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      tapNumber: 2,
      fullMnemonicWords: [],
      mnemonicWords: []
    };
  }

  componentDidMount() {
    this.resetValidation();
  }

  async resetValidation() {
    const fullMnemonicWords = await WalletUtilities.getMnemonic();
    this.setState(this.getDefault(fullMnemonicWords.split(" ")));
    this.setState({
      fullMnemonicWords: fullMnemonicWords.split(" ")
    });
  }

  getDefault(mnemonicWords) {
    return {
      mnemonicWords: [
        mnemonicWords[0],
        mnemonicWords[1],
        "",
        "",
        mnemonicWords[4],
        "",
        mnemonicWords[6],
        "",
        mnemonicWords[8],
        mnemonicWords[9],
        mnemonicWords[10],
        "",
        mnemonicWords[12],
        "",
        mnemonicWords[14],
        mnemonicWords[15],
        mnemonicWords[16],
        "",
        mnemonicWords[18],
        "",
        mnemonicWords[20],
        mnemonicWords[21],
        mnemonicWords[22],
        ""
      ],
      tapNumber: 2,
      button2: false,
      button3: false,
      button7: false,
      button5: false,
      button11: false,
      button13: false,
      button17: false,
      button19: false,
      button23: false,
      mnemonicWordsValidation: true
    };
  }

  updateMnemonicArray(index, word) {
    LogUtilities.toDebugScreen(index, word);
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
    const mnemonicWords = this.state.mnemonicWords.join(" ");
    const mnemonicWord = await WalletUtilities.getMnemonic();

    if (
      WalletUtilities.validateMnemonic(mnemonicWords) &&
      mnemonicWords === mnemonicWord
    ) {
      this.setState({ mnemonicWordsValidation: true });
      LogUtilities.toDebugScreen("mne val will be updated");
      this.props.updateMnemonicWordsValidation(true);
      LogUtilities.toDebugScreen("mne val was updated");
      if (Platform.OS === "ios") {
        this.props.navigation.navigate("PortfolioHome");
      } else if (Platform.OS === "android") {
        this.props.navigation.navigate("PortfolioHome");
      }
    } else {
      this.setState({ mnemonicWordsValidation: false });
      LogUtilities.logInfo("form validation failed!");
    }
  }

  renderInvalidMnemonicWordsMessage() {
    return this.state.mnemonicWordsValidation ? null : (
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
    const { mnemonicWords, fullMnemonicWords } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.avoidKeyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                    style={{ textAlign: "center", padding: 4 }}
                    placeholder={(id + 1).toString()}
                    autoCapitalize="none"
                    maxLength={15}
                    onChangeText={(text) => {
                      this.handleTextChange(text, id);
                    }}
                    onSubmitEditing={
                      id === 23
                        ? LogUtilities.logInfo("done")
                        : () => this.focusNextInput((id + 1).toString())
                    }
                    returnKeyType={id === 23 ? "done" : "next"}
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
            {[
              [2, 19, 3],
              [17, 13, 23],
              [7, 5, 11]
            ].map((x) => (
              <Container
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
                marginTop={16}
                width="100%"
                key={x}
              >
                {x.map((x) => (
                  <MnemonicWordButton
                    disabled={this.state[`button${x}`]}
                    opacity={this.state[`button${x}`] ? 0.1 : 1}
                    onPress={() => {
                      this.updateMnemonicArray(
                        this.state.tapNumber,
                        fullMnemonicWords[x]
                      );
                      let changing = {};
                      changing.tapNumber = this.getNextPrime(
                        this.state.tapNumber
                      );
                      changing[`button${x}`] = true;
                      this.setState(changing);
                    }}
                    key={x}
                  >
                    {fullMnemonicWords[x]}
                  </MnemonicWordButton>
                ))}
              </Container>
            ))}
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
              onPress={() => {
                this.validateForm();
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
    flexWrap: "wrap",
    flexDirection: "row"
  },
  cell: {
    flexBasis: "25%",
    flex: 1,
    marginBottom: 8
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
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

const ButtonContainer = styled.View`
  margin-bottom: 56;
  margin-top: 24;
`;

const mapDispatchToProps = (dispatch) => {
  return {
    updateMnemonicWordsValidation: bindActionCreators(
      updateMnemonicWordsValidation,
      dispatch
    )
  };
};

export default connect(null, mapDispatchToProps)(VerifyMnemonic);
