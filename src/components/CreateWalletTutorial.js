'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne } from '../components/common';

export default class CreateWalletTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <View>
          <HeaderOne marginTop="96">Create Wallet</HeaderOne>
        </View>
        <Container>
          <Text>Your backup words is the only way to restore your wallet if your phone is lost, stoken, broken or upgraded.</Text>
          <Text>We will show you a list of words to save in the next screen. We strongly recommend that you write them down on a piece of paper. Please keep it somewhere safe.</Text>
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
