'use strict';
import React, { Component } from 'react';
import {
  RootContainer,
  ProgressBar,
  Button,
  HeaderTwo,
  Description
} from '../components/common';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';

class ShowMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      twoColor: '#eeeeee',
      progressBarWidth: '0%'
    };
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor={this.state.twoColor}
          threeColor="#eeeeee"
          marginRight="40%"
          width={this.state.progressBarWidth}
        />
        <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
          Save Backup Words
        </HeaderTwo>
        <Description marginBottom="8" marginLeft="8" marginTop="16">
          carefully save your backup words in order
        </Description>
        <ShowMnemonicWords />
        <Button
          text="Verify Backup Words"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="24px auto"
          marginBottom="8px"
          opacity="1"
          onPress={() => this.props.navigation.navigate('VerifyMnemonic')}
        />
      </RootContainer>
    );
  }
}

export default ShowMnemonic;
