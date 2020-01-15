'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, ProgressBar, Button, HeaderTwo, Description } from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';

class NotificationPermissionTutorial extends Component {
  notificationPermissionNavigation() {
    if (this.props.notificationPermission === null) {
      console.log('notification permission is not set');
    } else if (this.props.notificationPermission === true) {
      this.props.navigation.navigate('WalletCreation');
    } else if (this.props.notificationPermission === false) {
      this.props.navigation.navigate('NotificationPermissionNotGranted');
    }
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor="#FDC800"
          threeColor="#FDC800"
          marginRight="0%"
          width="80%"
        />
        <Container>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
            Almost done!
          </HeaderTwo>
          <NotificationPermissionImage source={require('../../assets/notification_tutorial.png')} />
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            We use a notification system to process your transactions.
          </Description>
          <Button
            text="Enable Now"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="16px auto"
            opacity="1"
            onPress={async () => {
              await FcmPermissions.checkFcmPermissions();
              this.notificationPermissionNavigation();
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  margin-top: 40;
  text-align: center;
`;

const NotificationPermissionImage = styled.Image`
  height: 320px;
  width: 320px;
`;

const mapStateToProps = state => ({
  notificationPermission: state.ReducerNotificationPermission.notificationPermission
});

export default connect(mapStateToProps)(NotificationPermissionTutorial);
