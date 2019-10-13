'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

export default class ShowMnemonicWord extends Component {
  render() {
    const { mnemonicWord } = this.props;
    return (
      <MnemonicWordsWrapper style={styles.cell}>
        <Text style={styles.text}>{mnemonicWord}</Text>
      </MnemonicWordsWrapper>
    );
  }
}

const styles = {
  cell: {
    flexBasis: '25%',
    flex: 1
  },
  text: {
    fontSize: 16,
    padding: 4,
    textAlign: 'center'
  }
};

const MnemonicWordsWrapper = styled.View`
  background: #fff;
  border-radius: 16px;
  border-color: #f8f8f8;
  border-width: 4px;
  text-align: center;
`;
