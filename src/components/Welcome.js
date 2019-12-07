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
              marginBottom="16"
              marginLeft="0"
              marginTop="0"
            >
              share your crypto assets,
            </HeaderTwo>
            <HeaderTwo
              fontSize="24px"
              fontWeight="bold"
              marginBottom="16"
              marginLeft="0"
              marginTop="0"
            >
              earn passive income
            </HeaderTwo>
            <TouchableCardContainer
              alignItems="center"
              flexDirection="row"
              height="120px"
              justifyContent="space-between"
              textAlign="left"
              width="80%"
              onPress={() => {
                this.props.navigation.navigate('CreateWalletTutorial');
              }}
            >
              <View>
                <HeaderThree color="#00A3E2" marginBottom="0" marginLeft="8" marginTop="0">
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
              justifyContent="space-between"
              textAlign="left"
              width="80%"
              onPress={() => this.props.navigation.navigate('ImportOptions')}
            >
              <View>
                <HeaderThree color="#00A3E2" marginBottom="0" marginLeft="8" marginTop="0">
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
  font-size: 64px;
  margin-bottom: 16px;
  text-align: center;
`);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #E41B13;
  font-family: 'HKGrotesk-Bold';
  font-size: 40px;
  margin-bottom: 48px;
  text-align: center;
  text-transform: uppercase;
`);

const TitleRedText = styled.Text`
  color: #E41B13;
  font-family: 'HKGrotesk-Regular';
`;

const TitleGreenText = styled.Text`
  color: #1BA548;
  font-family: 'HKGrotesk-Regular';
`;

const TitleOrangeText = styled.Text`
  color: #FDC800;
  font-family: 'HKGrotesk-Regular';
`;

const CardText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16px;
  margin-left: 8px;
  padding-top: 8px;
  padding-right: 32px;
  text-align: left;
`;

const CardImage = styled.Image`
  height: 64px;
  margin-right: 8px;
  padding: 16px;
  resizeMode: contain;
  width: 64px;
`;
