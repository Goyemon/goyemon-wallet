'use strict';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  RootContainer,
  ProgressBar,
  HeaderTwo,
  Description,
  Button
} from '../components/common/';
import I18n from '../i18n/I18n';

export default class ImportOptions extends Component {
  render() {
    const { navigation } = this.props;
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
          {I18n.t('import-options-title')}
        </HeaderTwo>
        <Description marginBottom="8" marginLeft="8" marginTop="16">
          {I18n.t('import-options-description')}
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
              navigation.navigate('ImportTwelveMnemonicWords');
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
              navigation.navigate('ImportTwentyFourMnemonicWords');
            }}
          />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const ButtonContainer = styled.View`
  margin-top: 40;
`;
