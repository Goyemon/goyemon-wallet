'use strict';
import React, { Component } from 'react';
import { RootContainer, Button } from '../components/common';
import { Text } from 'react-native';
import styled from 'styled-components/native';

export default class NotificationPermissionTutorial extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <Text>I need to ask you only one more thing…</Text>
          <Text>We use a notification system to process your transactions. But we will never annoy you with a pop-up notification. </Text>
          <Button
            text="Allow Notifications"
            textColor="white"
            backgroundColor="#4083FF"
            margin="16px auto"
            opacity="1"
            onPress={() => this.props.navigation.navigate('NotificationPermission')}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 240px;
  text-align: center;
`;
