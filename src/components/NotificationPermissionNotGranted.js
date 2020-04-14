'use strict';
import React, { Component } from 'react';
import { Platform, Linking, Text } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import styled from 'styled-components/native';
import {
  RootContainer,
  Button,
  HeaderTwo,
  Description
} from '../components/common';

export default class NotificationPermissionNotGranted extends Component {
  render() {
    return (
      <RootContainer>
        <NoPermissionContainer>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="96px">
            whoops!
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="8" marginTop="16">
            please enable notifications
          </Description>
          <NotificationPermissionDeniedImage
            source={require('../../assets/notification_not_granted.png')}
          />
          <Description marginBottom="0" marginLeft="0" marginTop="16">
            we use them for transaction updates
          </Description>
          <Description marginBottom="0" marginLeft="0" marginTop="16">
            there will be no pop-ups
          </Description>
          <Button
            text="Go To Device Settings"
            textColor="#5F5F5F"
            backgroundColor="#EEEEEE"
            borderColor="#EEEEEE"
            margin="24px auto"
            marginBottom="12px"
            opacity="1"
            onPress={() => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings://notification/Goyemon');
              } else if (Platform.OS === 'android') {
                AndroidOpenSettings.appNotificationSettings();
              }
            }}
          />
          <Text>*relaunch your app once you enable them</Text>
        </NoPermissionContainer>
      </RootContainer>
    );
  }
}

const NoPermissionContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const NotificationPermissionDeniedImage = styled.Image`
  height: 320px;
  width: 320px;
`;
