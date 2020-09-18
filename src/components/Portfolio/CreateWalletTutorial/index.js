"use strict";
import React, { Component } from "react";
import {
  RootContainer,
  Container,
  Button,
  HeaderTwo,
  Description,
  Loader
} from "../../common";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";
import LogUtilities from "../../../utilities/LogUtilities";

class CreateWalletTutorial extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  async setupMnemonic() {
    const mnemonicWordList = await WalletUtilities.getMnemonic()
    const mnemonicWords = mnemonicWordList.split(" ")
    // LogUtilities.toDebugScreen(mnemonicWords)
    if (
      mnemonicWords !== null &&
      mnemonicWords.length === 12 ||
      mnemonicWords.length === 24
    ) {
      this.setState({ loading: false, buttonDisabled: false });
      this.props.navigation.navigate("ShowMnemonic");
    }
  }

  render() {
    return (
      <RootContainer>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="90%"
        >
          <HeaderTwo marginBottom="24" marginLeft="0" marginTop="112">
            With Great Power Comes Great Responsibility
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            Remember
          </Description>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            Backup words are the only way to restore your wallet. ONLY you have
            access to them.
          </Description>
          <Button
            text="Save Backup Words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="40px auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.setState({
                loading: true,
                buttonDisabled: true
              });
              await WalletUtilities.init();
              this.setupMnemonic()
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </Container>
      </RootContainer>
    );
  }
}

export default CreateWalletTutorial;
