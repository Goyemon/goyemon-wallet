'use strict';
import React, { Component } from 'react';
import { RootContainer, Button, HeaderTwo, Description } from '../components/common';
import { Platform, Linking } from 'react-native';
import styled from 'styled-components/native';
import AndroidOpenSettings from 'react-native-android-open-settings'

export default class NotificationPermissionNotGranted extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <NoPermissionContainer>
            <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
              oops!
            </HeaderTwo>
            <Description marginBottom="8" marginLeft="8" marginTop="16">
              please go to the notification settings and enable them
            </Description>
            <NotificationPermissionDeniedImage
              source={require('../../assets/notification_not_granted.png')}
            />
            <Description marginBottom="0" marginLeft="0" marginTop="16">
              - We use a notification system to update your transactions in the background.
            </Description>
            <Description marginBottom="0" marginLeft="0" marginTop="0">
              - We respect your attention. We will never annoy you with a pop-up.
            </Description>
            <Button
              text="Go To Device Settings"
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              borderColor="#EEEEEE"
              margin="16px auto"
              opacity="1"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings://notification/DeBank');
                } else if (Platform.OS === 'android') {
                  AndroidOpenSettings.appNotificationSettings();
                }
              }}
            />
          </NoPermissionContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  margin-top: 120px;
  width: 95%;
`;

const NoPermissionContainer = styled.View`
  alignItems: center;
  flexDirection: column;
`;

const NotificationPermissionDeniedImage = styled.Image`
  height: 320px;
  width: 320px;
`;
