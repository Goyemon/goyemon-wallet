'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { RootContainer, Button, HeaderTwo } from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

export default class Welcome extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <HollaContainer animation="fadeInDown" delay={500}>
            <Title>
              <TitleRedText>h</TitleRedText>
              <TitleGreenText>o</TitleGreenText>
              <TitleOrangeText>ll</TitleOrangeText>
              <TitleGreenText>a</TitleGreenText>
              <TitleRedText>!</TitleRedText>
            </Title>
          </HollaContainer>
          <WelcomeContainer animation="fadeIn" delay={2000}>
            <Title>
              Welcome to
            </Title>
            <Logo>
              Crypterest
            </Logo>
            <HeaderTwo
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24"
              marginLeft="0"
              marginTop="16"
            >
              share your crypto assets,
            </HeaderTwo>
            <HeaderTwo
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24"
              marginLeft="0"
              marginTop="0"
            >
              earn passive income
            </HeaderTwo>
            <ButtonWrapper>
              <Button
                text="Continue"
                textColor="#009DC4"
                backgroundColor="#FFF"
                borderColor="#009DC4"
                margin="16px auto"
                opacity="1"
                onPress={() => this.props.navigation.navigate('Start')}
              />
            </ButtonWrapper>
          </WelcomeContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  margin-top: 240px;
  text-align: center;
`;

const HollaContainer = Animatable.createAnimatableComponent(styled.View`
  flex: 1;
  margin-top: 16px;
  text-align: center;
`);

const WelcomeContainer = Animatable.createAnimatableComponent(styled.View`
  alignItems: center;
  flex: 1;
  margin-top: 20px;
`);

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
`);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #ff3346;
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
`);

const TitleRedText = styled.Text`
  color: #ff3346;
`;

const TitleGreenText = styled.Text`
  color: #12bb4f;
`;

const TitleOrangeText = styled.Text`
  color: #ffbf00;
`;

const ButtonWrapper = Animatable.createAnimatableComponent(styled.View`
  font-size: 40px;
`);
