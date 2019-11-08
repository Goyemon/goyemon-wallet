'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Text } from 'react-native';
import { RootContainer, ProgressBar, HeaderTwo, Description, Button } from '../components/common/';

export default class ImportOptions extends Component {
  render() {
    return (
      <RootContainer>
        <ProgressBar oneColor="#5f5f5f" twoColor="#eeeeee" threeColor="#eeeeee" marginRight="40%" width="0%" />
        <Container>
          <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
            Backup Words Option
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            How many backup words do you have?
          </Description>
          <ButtonContainer>
            <Button
              text="12 Words"
              textColor="#009DC4"
              backgroundColor="#FFF"
              borderColor="#009DC4"
              margin="8px auto"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('ImportTwelveMnemonicWords');
              }}
            />
            <Button
              text="24 Words"
              textColor="#009DC4"
              backgroundColor="#FFF"
              borderColor="#009DC4"
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
  marginTop: 40;
`;
