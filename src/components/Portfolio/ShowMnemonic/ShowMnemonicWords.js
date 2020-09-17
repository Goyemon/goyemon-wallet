"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components/native";
import ShowMnemonicWord from "./ShowMnemonicWord";

class ShowMnemonicWords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonicWords: props.mnemonicWords.split(" ")
    };
  }
  render() {
    const { mnemonicWords } = this.state;

    return (
      <MnemonicWordsContainer style={styles.table}>
        {mnemonicWords.map((mnemonicWord, id) => (
          <ShowMnemonicWord key={id} mnemonicWord={mnemonicWord} />
        ))}
      </MnemonicWordsContainer>
    );
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

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

export default connect(mapStateToProps)(ShowMnemonicWords);
