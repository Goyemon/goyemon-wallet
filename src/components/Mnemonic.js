'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

export default class Mnemonic extends Component {
  render() {
    const { splitMnemonic } = this.props;
    return (
      <MnemonicWordWrapper style={styles.cell}>
        <Text style={styles.text}>{splitMnemonic}</Text>
      </MnemonicWordWrapper>
    )
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

const MnemonicWordWrapper = styled.View`
  background: #fff;
  border-radius: 16px;
  border-color: #f8f8f8;
  border-width: 4px;
  text-align: center;
`;
