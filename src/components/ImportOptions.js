'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import { RootContainer, ProgressBar, HeaderTwo, Description, Button } from '../components/common/';

export default class ImportOptions extends Component {
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
            Backup Words Option
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            how many backup words do you have?
          </Description>
          <ButtonContainer>
            <Button
              text="12 Words"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="8px auto"
              marginBottom="12px"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('ImportTwelveMnemonicWords');
              }}
            />
            <Button
              text="24 Words"
              textColor="#00A3E2"
              backgroundColor="#FFF"
              borderColor="#00A3E2"
              margin="8px auto"
              marginBottom="12px"
              opacity="1"
              onPress={async () => {
                this.props.navigation.navigate('ImportTwentyFourMnemonicWords');
              }}
            />
          </ButtonContainer>
      </RootContainer>
    );
  }
}

const ButtonContainer = styled.View`
  marginTop: 40;
`;
