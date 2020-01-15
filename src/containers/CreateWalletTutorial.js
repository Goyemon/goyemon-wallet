'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveMnemonicWords } from '../actions/ActionMnemonic';
import { RootContainer, Button, HeaderTwo, Description } from '../components/common';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class CreateWalletTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <HeaderTwo marginBottom="24" marginLeft="0" marginTop="144">
            With Great Power Comes Great Responsibility
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            - the backup words are the only way to restore your wallet
          </Description>
          <Description marginBottom="16" marginLeft="0" marginTop="8">
            - only you have access to backup words. We do NOT.
          </Description>
          <Button
            text="Write down backup words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await WalletUtilities.init();
              await this.props.saveMnemonicWords();
              this.props.navigation.navigate('ShowMnemonic');
            }}
          />
          <Button
            text="Do This Later"
            textColor="#00A3E2"
            backgroundColor="#F8F8F8"
            borderColor="#F8F8F8"
            margin="0 auto"
            opacity="1"
            onPress={async () => {
              await WalletUtilities.init();
              await this.props.saveMnemonicWords();
              this.props.navigation.navigate('NotificationPermissionTutorial');
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const mapDispatchToProps = {
  saveMnemonicWords
};

export default connect(
  null,
  mapDispatchToProps
)(CreateWalletTutorial);
