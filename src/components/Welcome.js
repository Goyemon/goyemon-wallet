'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import {
  RootContainer,
  Button,
  HeaderTwo,
  HeaderThree,
  TouchableCardContainer
} from '../components/common';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePassed: false
    };
  }

  hollaFadeInOut() {
    setTimeout(() => {
      this.setState({ timePassed: true });
    }, 2000);

    if (this.state.timePassed) {
      return (
        <HollaContainer animation="fadeOut">
          <Title>
            <TitleRedText>h</TitleRedText>
            <TitleGreenText>o</TitleGreenText>
            <TitleOrangeText>ll</TitleOrangeText>
            <TitleGreenText>a</TitleGreenText>
            <TitleRedText>!</TitleRedText>
          </Title>
        </HollaContainer>
      );
    }
    return (
      <HollaContainer animation="fadeInDown">
        <Title>
          <TitleRedText>h</TitleRedText>
          <TitleGreenText>o</TitleGreenText>
          <TitleOrangeText>ll</TitleOrangeText>
          <TitleGreenText>a</TitleGreenText>
          <TitleRedText>!</TitleRedText>
        </Title>
      </HollaContainer>
    );
  }

  render() {
    return (
      <RootContainer>
        <Container>
          {this.hollaFadeInOut()}
          <WelcomeContainer animation="fadeIn" delay={4000}>
            <Logo>Crypterest</Logo>
            <HeaderTwo
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24"
              marginLeft="0"
              marginTop="0"
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
            <TouchableCardContainer
              alignItems="center"
              flexDirection="row"
              height="120px"
              justifyContent="center"
              textAlign="left"
              width="90%"
              onPress={() => {
                this.props.navigation.navigate('CreateWalletTutorial');
              }}
            >
              <View>
                <HeaderThree marginBottom="0" marginLeft="0" marginTop="0">
                  Create
                </HeaderThree>
                <CardText>new wallet</CardText>
              </View>
              <View>
                <CardImage source={require('../../assets/create_wallet_icon.png')} />
              </View>
            </TouchableCardContainer>
            <TouchableCardContainer
              alignItems="center"
              flexDirection="row"
              height="120px"
              justifyContent="center"
              textAlign="left"
              width="90%"
              onPress={() => this.props.navigation.navigate('ImportOptions')}
            >
              <View>
                <HeaderThree marginBottom="0" marginLeft="0" marginTop="0">
                  Import
                </HeaderThree>
                <CardText>existing wallet</CardText>
              </View>
              <View>
                <CardImage source={require('../../assets/import_wallet_icon.png')} />
              </View>
            </TouchableCardContainer>
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
  margin-top: 80px;
`);

const WelcomeContainer = Animatable.createAnimatableComponent(styled.View`
  alignItems: center;
  flex: 1;
  margin-top: -120px;
`);

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
`);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #ff3346;
  font-family: 'HKGrotesk-Regular';
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
`);

const TitleRedText = styled.Text`
  color: #ff3346;
  font-family: 'HKGrotesk-Regular';
`;

const TitleGreenText = styled.Text`
  color: #12bb4f;
  font-family: 'HKGrotesk-Regular';
`;

const TitleOrangeText = styled.Text`
  color: #ffbf00;
  font-family: 'HKGrotesk-Regular';
`;

const CardText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  padding-top: 8px;
  padding-right: 32px;
  text-align: left;
`;

const CardImage = styled.Image`
  height: 64px;
  padding: 16px;
  resizeMode: contain;
  width: 64px;
`;
