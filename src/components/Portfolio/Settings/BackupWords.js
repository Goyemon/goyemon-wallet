"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { RootContainer, Container, HeaderOne, Description } from "../../common";
import I18n from "../../../i18n/I18n";

class BackupWords extends Component {
  render() {
    const mnemonicWords = this.props.mnemonicWords.split(" ");

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
          <Description marginBottom="16" marginLeft="8" marginTop="16">
            {I18n.t("settings-backup-words-description")}
          </Description>
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

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

export default connect(mapStateToProps)(BackupWords);
