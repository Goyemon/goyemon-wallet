'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderOne } from '../components/common';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';

export default class ShowMnemonic extends Component {
  render() {
    return (
      <RootContainer>
        <View>
          <HeaderOne>Create Wallet</HeaderOne>
        </View>
        <Container>
          <Text>Please carefully write down these 24 backup words.</Text>
          <ShowMnemonicWords />
          <Text>we will confirm this phrase on the next screen</Text>
          <Button
            text="I’ve written them down"
            textColor="white"
            backgroundColor="#4083FF"
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
