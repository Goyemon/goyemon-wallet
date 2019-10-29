'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, ProgressBar, Button, HeaderOne, HeaderThree, OneLiner } from '../components/common';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';

export default class ShowMnemonic extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar text="1" width="33%" />
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="16" marginLeft="0" marginTop="24">
          Backup Words
        </OneLiner>
        <Container>
          <HeaderThree color="#000" fontSize="20px" marginBottom="8" marginLeft="8" marginTop="16">
            Please carefully write down these 24 backup words.
          </HeaderThree>
          <ShowMnemonicWords />
          <HeaderThree color="#000" fontSize="20px" marginBottom="8" marginLeft="8" marginTop="16">
            we will confirm this phrase on the next screen
          </HeaderThree>
          <Button
            text="I’ve written them down"
            textColor="white"
            backgroundColor="#009DC4"
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
