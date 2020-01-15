'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import {
  RootContainer,
  Button,
  HeaderTwo,
  HeaderThree,
  TouchableCardContainer
} from '../components/common';

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
              fontSize="24"
              fontWeight="bold"
              marginBottom="16"
              marginLeft="0"
              marginTop="0"
            >
              share your crypto assets,
            </HeaderTwo>
            <HeaderTwo
              fontSize="24"
              fontWeight="bold"
              marginBottom="80"
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
              <CardImage source={require('../../assets/create_wallet_icon.png')} />
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
              <CardImage source={require('../../assets/import_wallet_icon.png')} />
            </TouchableCardContainer>
          </WelcomeContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  text-align: center;
`;

const HollaContainer = Animatable.createAnimatableComponent(styled.View`
  margin-top: ${hp('40%')};
`);

const WelcomeContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
  flex: 1;
  margin-top: ${hp('-40%')};
`);

const Title = Animatable.createAnimatableComponent(styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 64;
  margin-bottom: 16;
  text-align: center;
`);

const Logo = Animatable.createAnimatableComponent(styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Bold';
  font-size: 40;
  margin-bottom: 48;
  text-align: center;
  text-transform: uppercase;
`);

const TitleRedText = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
`;

const TitleGreenText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
`;

const TitleOrangeText = styled.Text`
  color: #fdc800;
  font-family: 'HKGrotesk-Regular';
`;

const CardText = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-left: 8;
  padding-top: 8px;
  padding-right: 32px;
  text-align: left;
`;

const CardImage = styled.Image`
  height: 64px;
  margin-right: 8;
  padding: 16px;
  resize-mode: contain;
  width: 64px;
`;
