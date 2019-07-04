'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Mnemonic from '../components/Mnemonic';

class MnemonicPhrases extends Component {
  render() {
    const { mnemonic } = this.props;
    const splitMnemonic = mnemonic.split(' ');

    return (
      <MnemonicPhrasesContainer style={styles.table}>
        {splitMnemonic.map((splitMnemonic, id) => (
          <Mnemonic key={id} splitMnemonic={splitMnemonic} />
        ))}
      </MnemonicPhrasesContainer>
    );
  }
}

const styles = {
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
};

const MnemonicPhrasesContainer = styled.View`
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
