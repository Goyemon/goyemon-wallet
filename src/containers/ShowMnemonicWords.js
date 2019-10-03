'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ShowMnemonicWord from '../components/ShowMnemonicWord';

class ShowMnemonicWords extends Component {
  render() {
    const mnemonicWords = this.props.mnemonicWords.split(' ');

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
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
};

const MnemonicWordsContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 95%;
`;

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

export default connect(mapStateToProps)(ShowMnemonicWords);
