'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Text } from 'react-native';
import { RootContainer, HeaderOne, Button } from '../components/common/';

export default class ImportOptions extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne>Import Wallet</HeaderOne>
        <Text>How many words do you have?</Text>
        <Container>
          <ButtonContainer>
            <Button
              text="12 Words"
              textColor="white"
              backgroundColor="#4083FF"
              margin="24px auto"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('Import');
              }}
            />
          </ButtonContainer>
          <ButtonContainer>
            <Button
              text="24 Words"
              textColor="white"
              backgroundColor="#4083FF"
              margin="24px auto"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('Import');
              }}
            />
          </ButtonContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.ScrollView.attrs(props => ({
  contentContainerStyle: props => ({
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  })
}))``;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;
