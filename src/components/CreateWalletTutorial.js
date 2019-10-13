'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne, OneLiner } from '../components/common';

export default class CreateWalletTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <OneLiner fontSize="24px" fontWeight="bold" marginBottom="24" marginLeft="0" marginTop="96">
          No Backup, No Money
        </OneLiner>
        <Container>
          <Text>
            Your backup words are the only way to restore your wallet if your phone is lost, stoken,
            broken or upgraded.
          </Text>
          <Text>
            We will show you a list of words to save in the next screen. We strongly recommend that
            you write them down on a piece of paper. Please keep it somewhere safe.
          </Text>
          <Button
            text="Write down backup words"
            textColor="white"
            backgroundColor="#009DC4"
            margin="24px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('ShowMnemonic')}
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
