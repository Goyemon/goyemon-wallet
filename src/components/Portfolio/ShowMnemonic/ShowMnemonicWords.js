"use strict";
import React from "react";
import { GoyemonText } from "../../common/Texts";
import styled from "styled-components/native";
import WalletUtilities from "../../../utilities/WalletUtilities.ts";
import ShowMnemonicWord from "./ShowMnemonicWord";
import LogUtilities from "../../../utilities/LogUtilities"

class ShowMnemonicWords extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mnemonicWords: []
    }
  }

  async componentDidMount() {
    await WalletUtilities.init();
    const mnemonicWord = await WalletUtilities.getMnemonic()
    LogUtilities.toDebugScreen("this is mne", mnemonicWord)
    const mnemonicWords = mnemonicWord.split(" ")
    if (mnemonicWords.length > 0)
      this.setState({ mnemonicWords: mnemonicWords })
  }

  render() {
      const { mnemonicWords } = this.state
      return (
        <MnemonicWordsContainer style={styles.table}>
          {mnemonicWords.map((mnemonicWord, id) => (
           <ShowMnemonicWord key={id} mnemonicWord={mnemonicWord} />
           ))}
        </MnemonicWordsContainer>
      )
  }
}

const styles = {
  table: {
    flexWrap: "wrap",
    flexDirection: "row"
  }
};

const MnemonicWordsContainer = styled.View`
  margin-top: 24;
  margin-bottom: 24;
  width: 95%;
`;

export default ShowMnemonicWords;
