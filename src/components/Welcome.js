'use strict';
import React, { Component } from 'react';
import { RootContainer, Button } from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

export default class Welcome extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <Title animation="fadeInDown" delay={500}>
            Holla!
          </Title>
          <Title animation="fadeIn" delay={2000}>
            Ready to join ?
          </Title>
          <ButtonWrapper animation="fadeIn" delay={4000}>
            <Button
              text="Hell Yeah!"
              textColor="white"
              backgroundColor="#4083FF"
              margin="16px auto"
              opacity="1"
              onPress={() => this.props.navigation.navigate('NotificationPermissionTutorial')}
            />
          </ButtonWrapper>
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

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-size: 40px;
  margin-bottom: 16px;
  text-align: center;
`);

const ButtonWrapper = Animatable.createAnimatableComponent(styled.View`
  font-size: 40px;
  alignItems: center;
`);
