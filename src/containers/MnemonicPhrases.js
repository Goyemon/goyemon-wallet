'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Mnemonic from '../components/Mnemonic';

class MnemonicPhrases extends Component {
  render() {
    const mnemonicWords = this.props.mnemonic.split(' ');

    return (
      <MnemonicWordsContainer style={styles.table}>
        {mnemonicWords.map((mnemonicWord, id) => (
          <Mnemonic key={id} mnemonicWord={mnemonicWord} />
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
    mnemonic: state.ReducerMnemonic.mnemonic
  };
}

export default connect(mapStateToProps)(MnemonicPhrases);
