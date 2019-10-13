'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Text } from 'react-native';
import { RootContainer, ProgressBar, HeaderOne, Button } from '../components/common/';

export default class ImportOptions extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar text="1" width="33%" />
        <Container>
          <Text>How many backup words do you have?</Text>
          <ButtonContainer>
            <Button
              text="12 Words"
              textColor="white"
              backgroundColor="#009DC4"
              margin="8px auto"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('ImportTwelveMnemonicWords');
              }}
            />
          </ButtonContainer>
          <ButtonContainer>
            <Button
              text="24 Words"
              textColor="white"
              backgroundColor="#009DC4"
              margin="8px auto"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('ImportTwentyFourMnemonicWords');
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
