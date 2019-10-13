'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { RootContainer, Button } from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

export default class Welcome extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <Title animation="fadeInDown" delay={500}>
            <TitleRedText>h</TitleRedText><TitleGreenText>o</TitleGreenText><TitleOrangeText>ll</TitleOrangeText><TitleGreenText>a</TitleGreenText><TitleRedText>!</TitleRedText>
          </Title>
          <Title animation="fadeIn" delay={2000}>
            ready to join?
          </Title>
          <ButtonWrapper animation="fadeIn" delay={4000}>
            <Button
              text="Hell Yeah!"
              textColor="white"
              backgroundColor="#009DC4"
              margin="16px auto"
              opacity="1"
              onPress={() => this.props.navigation.navigate('Start')}
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
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
`);

const TitleRedText = styled.Text`
  color: #FF3346
`;

const TitleGreenText = styled.Text`
  color: #12BB4F
`;

const TitleOrangeText = styled.Text`
  color: #FFBF00
`;

const ButtonWrapper = Animatable.createAnimatableComponent(styled.View`
  font-size: 40px;
  alignItems: center;
`);
