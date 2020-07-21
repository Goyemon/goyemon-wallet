'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import CompoundIcon from '../../assets/CompoundIcon.js';
import PoolTogetherIcon from '../../assets/PoolTogetherIcon.js';
import UniswapIcon from '../../assets/UniswapIcon.js';
import {
  RootContainer,
  HeaderThree,
  TouchableCardContainer
} from '../components/common';
import I18n from '../i18n/I18n';
import WalletUtilities from '../utilities/WalletUtilities';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePassed: false
    };
  }

  async componentDidMount() {
    const privateKeySaved = await WalletUtilities.privateKeySaved();
    if (privateKeySaved) {
      await WalletUtilities.resetKeychainData();
    }
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
    const { navigation } = this.props;
    return (
      <RootContainer>
        {this.hollaFadeInOut()}
        <WelcomeFirstContainer animation="fadeIn" delay={4000}>
          <Logo>Goyemon</Logo>
          <OneLinerContainer>
            <OneLiner>
              new generation financial services at your fingertips
            </OneLiner>
          </OneLinerContainer>
          <IconContainer>
            <IconImage>
              <CoinImage source={require('../../assets/ether_icon.png')} />
            </IconImage>
            <IconImage>
              <CoinImage source={require('../../assets/dai_icon.png')} />
            </IconImage>
            <IconImage>
              <CompoundIcon />
            </IconImage>
            <IconImage>
              <UniswapIcon />
            </IconImage>
            <IconImage>
              <PoolTogetherIcon />
            </IconImage>
          </IconContainer>
        </WelcomeFirstContainer>
        <WelcomeSecondContainer animation="fadeIn" delay={5000}>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="space-between"
            textAlign="left"
            width="80%"
            onPress={() => {
              navigation.navigate('CreateWalletTutorial');
            }}
          >
            <View>
              <HeaderThree
                color="#00A3E2"
                marginBottom="0"
                marginLeft="8"
                marginTop="0"
              >
                {I18n.t('welcome-create')}
              </HeaderThree>
              <CardText>{I18n.t('welcome-new-wallet')}</CardText>
            </View>
            <CardImage>
              <Icon name="account-plus-outline" size={48} color="#5f5f5f" />
            </CardImage>
          </TouchableCardContainer>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="row"
            height="120px"
            justifyContent="space-between"
            textAlign="left"
            width="80%"
            onPress={() => navigation.navigate('ImportMnemonicWords')}
          >
            <View>
              <HeaderThree
                color="#00A3E2"
                marginBottom="0"
                marginLeft="8"
                marginTop="0"
              >
                {I18n.t('welcome-import')}
              </HeaderThree>
              <CardText>{I18n.t('welcome-existing-wallet')}</CardText>
            </View>
            <CardImage>
              <Icon name="account-search-outline" size={48} color="#5f5f5f" />
            </CardImage>
          </TouchableCardContainer>
        </WelcomeSecondContainer>
      </RootContainer>
    );
  }
}

const HollaContainer = Animatable.createAnimatableComponent(styled.View`
  margin-top: ${hp('40%')};
`);

const WelcomeFirstContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
  flex: 1;
  margin-top: ${hp('-40%')};
`);

const WelcomeSecondContainer = Animatable.createAnimatableComponent(styled.View`
  align-items: center;
  flex: 1;
  margin-top: ${hp('0%')};
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
  margin-top: 48;
  margin-bottom: 48;
  text-align: center;
  text-transform: uppercase;
`);

const OneLinerContainer = styled.View`
  margin-bottom: 32;
`;

const OneLiner = styled.Text`
  color: #5f5f5f;
  font-size: 32;
  font-family: 'HKGrotesk-Bold';
  margin-bottom: 8;
  text-align: center;
`;

const IconContainer = styled.View`
  flex-direction: row;
  margin-bottom: 40;
`;

const IconImage = styled.View`
  margin-right: 8px;
  margin-left: 8px;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

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

const CardImage = styled.View`
  margin-right: 8;
`;
