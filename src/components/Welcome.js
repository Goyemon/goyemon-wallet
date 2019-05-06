'use strict';
import React, { Component } from 'react';
import { Button } from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

export default class Welcome extends Component {
  render() {
    return (
      <Container>
        <Title animation="fadeInDown" delay={500}>Holla!</Title>
        <Title animation="fadeIn" delay={2000}>ARE YOU READY?</Title>
        <ButtonWrapper animation="fadeIn" delay={4000}>
          <Button
          text="Hell Yeah!"
          textColor="white" backgroundColor="#01d1e5"
          marginTop="24px"
          onPress={() => this.props.navigation.navigate('Start')} />
        </ButtonWrapper>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  font-size: 40px;
  justify-content: center;
  align-items: center;
`;

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-size: 40px;
`);

const ButtonWrapper = Animatable.createAnimatableComponent(styled.View`
  font-size: 40px;
`);
