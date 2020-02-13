'use strict';
import React, { Component } from 'react';
import { Platform, Linking, Text } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import styled from 'styled-components/native';
import { RootContainer, Button, HeaderTwo, Description } from '../components/common';

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
              marginBottom="12px"
              opacity="1"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings://notification/Crypterest');
                } else if (Platform.OS === 'android') {
                  AndroidOpenSettings.appNotificationSettings();
                }
              }}
            />
            <Text>*relaunch your app once you enable them</Text>
          </NoPermissionContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  margin-top: 120;
  width: 95%;
`;

const NoPermissionContainer = styled.View`
  align-items: center;
  flex-direction: column;
`;

const NotificationPermissionDeniedImage = styled.Image`
  height: 320px;
  width: 320px;
`;
