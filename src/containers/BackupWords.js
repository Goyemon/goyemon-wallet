'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, HeaderOne } from '../components/common';

class BackupWords extends Component {
  render() {
    const mnemonicWords = this.props.mnemonicWords.split(' ');

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Backup Words</HeaderOne>
        <Container>
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
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cell: {
    flexBasis: '25%',
    flex: 1
  }
};

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicWordsContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 95%;
`;

const MnemonicWordsWrapper = styled.View`
  background: #fff;
  border-radius: 16px;
  border-color: #f8f8f8;
  border-width: 4px;
  text-align: center;
`;

const MnemonicWordsText = styled.Text`
  fontSize: 16px;
  padding: 4px;
  textAlign: center;
`;

function mapStateToProps(state) {
  return {
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

export default connect(mapStateToProps)(BackupWords);
