'use strict';
import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Header } from './common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { Button } from '../components/common';
import { saveWeb3 } from '../actions/ActionWeb3';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';

class Import extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicPhrases: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ]
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange = (text, id) => {
    let mnemonicPhrases = this.state.mnemonicPhrases;
    mnemonicPhrases[id] = text;

    this.setState({mnemonicPhrases: mnemonicPhrases});
  }

  render() {
    return (
      <Container>
        <Title>Enter the backup phrases for the wallet you want to import</Title>
        {this.state.mnemonicPhrases.map((word, id) => (
          <TextInputContainer key={id}>
              <TextInput
                placeholder = "word"
                autoCapitalize = 'none'
                maxLength = {15}
                onChangeText = {(text) => {this.handleTextChange(text, id)} }
              />
              <Text>{id + 1}</Text>
          </TextInputContainer>
        ))}
        <ButtonContainer>
          <Button
            text="go"
            textColor="white"
            backgroundColor="#01d1e5"
            marginTop="24px"
            onPress={async () => {
              await this.validateForm()
            }}
          />
        </ButtonContainer>
      </Container>
    );
  }
}

const Container = styled.ScrollView`
  font-size: 40px;
`;

const Title = styled.Text`
  font-size: 32px;
`;

const TextInputContainer = styled.View`
  flexDirection: column;
  justifyContent: center;
  alignItems: center;
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const mapDispatchToProps = {
  getChecksumAddress,
  saveWeb3
};

export default connect(
  null,
  mapDispatchToProps
)(Import);
