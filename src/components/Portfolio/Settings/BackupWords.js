"use strict";
import React, { Component } from "react";
import styled from "styled-components/native";
import { RootContainer, Container, HeaderOne } from "../../common";
import I18n from "../../../i18n/I18n";
import WalletUtilities from "../../../utilities/WalletUtilities";

class BackupWords extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicWords: []
    };
  }

  async componentDidMount() {
    const mnemonicWords = await WalletUtilities.getMnemonic();
    this.setState({ mnemonicWords: mnemonicWords.split(" ") });
  }

  render() {
    const { mnemonicWords } = this.state;

    return (
      <RootContainer>
        <HeaderOne marginTop="96">
          {I18n.t("settings-backup-words-header")}
        </HeaderOne>
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={16}
          width="90%"
        >
          <MnemonicWordsContainer style={styles.table}>
            {mnemonicWords.map((mnemonicWord, id) => (
              <MnemonicWordsWrapper key={id} style={styles.cell}>
                <MnemonicWordsText>{mnemonicWord}</MnemonicWordsText>
              </MnemonicWordsWrapper>
            ))}
          </MnemonicWordsContainer>
        </Container>
      </RootContainer>
    );
  }
}

const styles = {
  table: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  cell: {
    flexBasis: "25%",
    flex: 1
  }
};

const MnemonicWordsContainer = styled.View`
  margin-top: 24;
  margin-bottom: 24;
  width: 95%;
`;

const MnemonicWordsWrapper = styled.View`
  background: #fff;
  border-radius: 16px;
  border-color: #f8f8f8;
  border-width: 4px;
  margin-bottom: 8;
  text-align: center;
`;

const MnemonicWordsText = styled.Text`
  font-family: "HKGrotesk-Regular";
  font-size: 16;
  padding: 4px;
  text-align: center;
`;

export default BackupWords;
