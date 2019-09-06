'use strict';
import React, { Component } from 'react';
import { RootContainer, HeaderOne, UntouchableCardContainer } from '../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import WalletController from '../wallet-core/WalletController.ts';

export default class Settings extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne  marginTop="96">Settings</HeaderOne>
        <UntouchableCardContainer
          alignItems="flex-start"
          flexDirection="column"
          height="240px"
          justifyContent="center"
          textAlign="left"
          width="95%"
         >
         <SettingsTextContainer>
           <Icon name="information-outline" color="#4E4E4E" size={32} />
           <SettingsText>About Us</SettingsText>
         </SettingsTextContainer>
         <SettingsTextContainer>
           <Icon name="message-text-outline" color="#4E4E4E" size={32} />
           <SettingsText>Talk to Us</SettingsText>
         </SettingsTextContainer>
         <SettingsTextContainer>
           <Button
             text="Erase Keychain Data"
             textColor="#4E4E4E"
             backgroundColor="#EEEEEE"
             margin="0"
             opacity="1"
             onPress={async () => {
               await WalletController.resetKeychainData();
             }}
           />
         </SettingsTextContainer>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const SettingsTextContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-bottom: 8px;
  margin-left: 24px;
  margin-top: 16px;
`;

const SettingsText = styled.Text`
  color: #4E4E4E
  font-size: 24px;
  margin-left: 8px;
`;
