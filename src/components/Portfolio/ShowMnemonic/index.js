"use strict";
import React, { Component } from "react";
import { RootContainer, Container, Button, Description } from "../../common";
import ShowMnemonicWords from "./ShowMnemonicWords";

class ShowMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      twoColor: "#eeeeee",
      progressBarWidth: "0%"
    };
  }

  render() {
    return (
      <RootContainer>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={96}
          width="90%"
        >
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            carefully save your backup words in order
          </Description>
          <ShowMnemonicWords />
          <Button
            text="Verify Backup Words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="24px auto"
            marginBottom="8px"
            opacity="1"
            onPress={() => this.props.navigation.navigate("VerifyMnemonic")}
          />
        </Container>
      </RootContainer>
    );
  }
}

export default ShowMnemonic;
