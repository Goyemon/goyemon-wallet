'use strict';
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderTwo, Description } from '../components/common';
import { connect } from 'react-redux';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import { saveMnemonic } from '../actions/ActionMnemonic';

class CreateWalletTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderTwo marginBottom="24" marginLeft="0" marginTop="120">
          With Great Power Comes Great Responsibility
        </HeaderTwo>
        <Container>
          <Description marginBottom="16" marginLeft="8" marginTop="16">
            Your backup words are the only way to restore your wallet if your phone is lost, stoken,
            broken or upgraded.
          </Description>
          <Description marginBottom="16" marginLeft="8" marginTop="16">
            We will show you a list of words to save in the next screen. We strongly recommend that
            you write them down on a piece of paper. Please keep it somewhere safe.
          </Description>
          <Button
            text="Write down backup words"
            textColor="#009DC4"
            backgroundColor="#FFF"
            borderColor="#009DC4"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await WalletUtilities.init();
              await this.props.saveMnemonic();
              this.props.navigation.navigate('ShowMnemonic');
            }}
          />
          <Button
            text="Do This Later"
            textColor="#009DC4"
            backgroundColor="#F8F8F8"
            borderColor="#F8F8F8"
            margin="0 auto"
            opacity="1"
            onPress={async () => {
              await WalletUtilities.init();
              await this.props.saveMnemonic();
              this.props.navigation.navigate('NotificationPermissionTutorial');
            }}
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

const mapDispatchToProps = {
  saveMnemonic
};

export default connect(
  null,
  mapDispatchToProps
)(CreateWalletTutorial);
