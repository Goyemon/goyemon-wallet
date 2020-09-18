"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import { KeyboardAvoidingView, Platform, View, Clipboard } from "react-native";
import styled from "styled-components/native";
import { updateMnemonicWordsValidation } from "../../../actions/ActionMnemonicWordsValidation";
import {
  RootContainer,
  Container,
  ProgressBar,
  HeaderTwo,
  Description,
  Button,
  ErrorMessage,
  Loader,
  GoyemonText
} from "../../common";
import I18n from "../../../i18n/I18n";
import LogUtilities from "../../../utilities/LogUtilities";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";

class ImportMnemonicWords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonicWords: "",
      mnemonicWordsValidation: true,
      loading: false,
      copiedText: ""
    };
  }

  async validateForm() {
    if (WalletUtilities.validateMnemonic(this.state.mnemonicWords)) {
      this.setState({ loading: true });
      this.setState({ mnemonicWordsValidation: true });
      this.props.updateMnemonicWordsValidation(true);
      await WalletUtilities.setMnemonic(this.state.mnemonicWords);
      if (Platform.OS === "ios") {
        this.props.navigation.navigate("NotificationPermissionTutorial");
      } else if (Platform.OS === "android") {
        this.props.navigation.navigate("WalletCreation");
      }
    } else {
      this.setState({ mnemonicWordsValidation: false });
      LogUtilities.logInfo("form validation failed!");
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

  fetchCopiedText = async () => {
    const copiedText = await Clipboard.getString();
    this.setState({ mnemonicWords: copiedText });
  };

  render() {
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
          <Container
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            marginTop={16}
            width="95%"
          >
            <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
              {I18n.t("import-title")}
            </HeaderTwo>
            <Description marginBottom="8" marginLeft="8" marginTop="16">
              {I18n.t("import-description")}
            </Description>
            <MnemonicWordsContainer>
              <MnemonicWordsInput
                autoCapitalize="none"
                multiline={true}
                textAlignVertical="top"
                onChangeText={(mnemonicWords) => {
                  mnemonicWords = mnemonicWords.toLowerCase();
                  this.setState({ mnemonicWords });
                }}
                placeholder="this is sample backup words type in your own backup words here"
                value={this.state.mnemonicWords}
              />
              <PasteContainer onPress={() => this.fetchCopiedText()}>
                <PasteText>PASTE</PasteText>
              </PasteContainer>
            </MnemonicWordsContainer>
            <GoyemonText fontSize={16}>
              *typically 12 or 24 words seperated by single spaces
            </GoyemonText>
            <Button
              text={I18n.t("button-next")}
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
            <View>{this.renderInvalidMnemonicWordsMessage()}</View>
            <Loader animating={this.state.loading} size="small" />
          </Container>
        </RootContainer>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  avoidKeyboard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  }
};

const MnemonicWordsContainer = styled.View`
  background: #fff;
  border-color: #f8f8f8;
  border-radius: 16px;
  border-width: 4px;
  margin: 24px auto;
  padding: 16px;
  width: 100%;
`;

const MnemonicWordsInput = styled.TextInput`
  font-family: "HKGrotesk-Regular";
  font-size: 20;
  height: 180px;
`;

const PasteContainer = styled.TouchableOpacity`
  align-items: flex-end;
`;

const PasteText = styled.Text`
  color: #00a3e2;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

const mapDispatchToProps = {
  updateMnemonicWordsValidation
};

export default connect(null, mapDispatchToProps)(ImportMnemonicWords);
