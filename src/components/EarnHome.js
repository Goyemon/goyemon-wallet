'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import CompoundIcon from '../../assets/CompoundIcon.js';
import {
  RootContainer,
  Container,
  TouchableCardContainer,
  HeaderOne,
  CrypterestText,
  SettingsIcon
} from './common';

export default class EarnHome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <SettingsIcon
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
      ),
      headerStyle: { height: 80 }
    };
  };

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Earn</HeaderOne>
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
          marginTop={16}
          width="100%"
        >
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => {
              if (this.props.cDaiLendingInfo.daiApproval) {
                this.props.navigation.navigate('DepositDai');
              } else if (!this.props.cDaiLendingInfo.daiApproval) {
                this.props.navigation.navigate('DepositFirstDai');
              } else {
                LogUtilities.logInfo('invalid approval value');
              }
            }}
          >
            <CrypterestText fontSize={24}>
              Deposit DAI to Compound
            </CrypterestText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-right-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <CompoundIcon />
              </IconImage>
            </IconImageContainer>
          </TouchableCardContainer>
          <TouchableCardContainer
            alignItems="center"
            flexDirection="column"
            height="160px"
            justifyContent="center"
            textAlign="left"
            width="90%"
            onPress={() => {
              this.props.navigation.navigate('WithdrawDai')
            }}
          >
            <CrypterestText fontSize={24}>
              Withdraw DAI from Compound
            </CrypterestText>
            <IconImageContainer>
              <IconImage>
                <CardImage source={require('../../assets/dai_icon.png')} />
              </IconImage>
              <IconImage>
                <Icon name="arrow-left-bold" size={20} color="#5F5F5F" />
              </IconImage>
              <IconImage>
                <CompoundIcon />
              </IconImage>
            </IconImageContainer>
          </TouchableCardContainer>
        </Container>
      </RootContainer>
    );
  }
}

const IconImageContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 16;
`;

const IconImage = styled.View`
  margin-left: 8;
  margin-right: 8;
`;

const CardImage = styled.Image`
  height: 40px;
  padding: 16px;
  resize-mode: contain;
  width: 40px;
`;
