'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import {
  RootContainer,
  ProgressBar,
  Button,
  HeaderTwo,
  Description,
  Loader
} from '../components/common';
import FcmPermissions from '../firebase/FcmPermissions.js';
import DebugUtilities from '../utilities/DebugUtilities.js';

class NotificationPermissionTutorial extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  notificationPermissionNavigation() {
    if (this.props.permissions.notification === null) {
      DebugUtilities.logInfo('notification permission is not set');
    } else if (this.props.permissions.notification === true) {
      this.props.navigation.navigate('WalletCreation');
    } else if (this.props.permissions.notification === false) {
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
            Almost Done!
          </HeaderTwo>
          <Description marginBottom="8" marginLeft="0" marginTop="16">
            we use a notification system to process your transactions
          </Description>
          <Button
            text="Enable Now"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="16px auto"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              this.setState({ loading: true, buttonDisabled: true });
              await FcmPermissions.checkFcmPermissions();
              this.notificationPermissionNavigation();
              this.setState({ loading: false, buttonDisabled: false });
            }}
          />
          <Loader animating={this.state.loading} />
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 auto;
  margin-top: 40;
  width: 90%;
`;

const mapStateToProps = state => ({
  permissions: state.ReducerNotificationPermission.permissions
});

export default connect(mapStateToProps)(NotificationPermissionTutorial);
