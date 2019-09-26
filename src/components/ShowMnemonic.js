'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, ProgressBar, Button, HeaderOne, OneLiner } from '../components/common';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';

export default class ShowMnemonic extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar
          text="1"
          width="33%"
        />
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="16" marginLeft="0" marginTop="24">Backup Words</OneLiner>
        <Container>
          <Text>Please carefully write down these 24 backup words.</Text>
          <ShowMnemonicWords />
          <Text>we will confirm this phrase on the next screen</Text>
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
