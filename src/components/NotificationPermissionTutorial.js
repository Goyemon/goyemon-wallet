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
          <Text>we are going to ask for your permission.</Text>
          <Text>we will never annoy you with pop-up notifications. We promise. ;)</Text>
          <Button
            text="Next"
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
