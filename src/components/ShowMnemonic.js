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
        <ProgressBar oneColor="#FDC800" twoColor="#eeeeee" threeColor="#eeeeee" marginRight="40%" width="0%" />
        <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
          Save Backup Words
        </HeaderTwo>
        <Container>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
          The order of words matters. We will confirm these words on the next screen.
          </Description>
          <ShowMnemonicWords />
          <Button
            text="I’ve written them down"
            textColor="#009DC4"
            backgroundColor="#FFF"
            borderColor="#009DC4"
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
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;
