'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, ProgressBar, Button, HeaderTwo, Description } from '../components/common';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';

export default class ShowMnemonic extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor="#eeeeee"
          threeColor="#eeeeee"
          marginRight="40%"
          width="0%"
        />
        <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
          Save Backup Words
        </HeaderTwo>
        <Container>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            carefully save your backup words in order
          </Description>
          <ShowMnemonicWords />
          <Button
            text="I’ve written them down"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="24px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('VerifyMnemonic')}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
