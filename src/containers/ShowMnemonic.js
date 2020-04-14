'use strict';
import React, { Component } from 'react';
import { Linking } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import CameraRoll from '@react-native-community/cameraroll';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { captureScreen } from 'react-native-view-shot';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { savePhotoLibraryPermission } from '../actions/ActionPermissions';
import {
  RootContainer,
  Container,
  ProgressBar,
  Button,
  HeaderTwo,
  Description,
  GoyemonText
} from '../components/common';
import ShowMnemonicWords from './ShowMnemonicWords';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';

class ShowMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      imageURI: undefined,
      screenshotTaken: false,
      nextButtonShown: false,
      twoColor: '#eeeeee',
      progressBarWidth: '0%'
    };
  }

  componentDidMount() {
    this.checkPhotoLibraryPermission();
  }

  requestPhotoLibraryPermission() {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
        this.checkPhotoLibraryPermission();
        LogUtilities.logInfo('result ===>', result);
      });
    } else if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
        this.checkPhotoLibraryPermission();
        LogUtilities.logInfo('result ===>', result);
      });
    }
  }

  checkPhotoLibraryPermission() {
    const { savePhotoLibraryPermission } = this.props;
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              savePhotoLibraryPermission('unavailable');
              LogUtilities.logInfo(
                'This feature is not available (on this device / in this context)'
              );
              break;
            case RESULTS.DENIED:
              savePhotoLibraryPermission('denied');
              LogUtilities.logInfo(
                'The permission has not been requested / is denied but requestable'
              );
              break;
            case RESULTS.GRANTED:
              savePhotoLibraryPermission('granted');
              LogUtilities.logInfo('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              savePhotoLibraryPermission('blocked');
              LogUtilities.logInfo(
                'The permission is denied and not requestable anymore'
              );
              break;
          }
        })
        .catch(error => {
          LogUtilities.logInfo('error ===>', error);
        });
    } else if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              savePhotoLibraryPermission('unavailable');
              LogUtilities.logInfo(
                'This feature is not available (on this device / in this context)'
              );
              break;
            case RESULTS.DENIED:
              savePhotoLibraryPermission('denied');
              LogUtilities.logInfo(
                'The permission has not been requested / is denied but requestable'
              );
              break;
            case RESULTS.GRANTED:
              savePhotoLibraryPermission('granted');
              LogUtilities.logInfo('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              savePhotoLibraryPermission('blocked');
              LogUtilities.logInfo(
                'The permission is denied and not requestable anymore'
              );
              break;
          }
        })
        .catch(error => {
          LogUtilities.logInfo('error ===>', error);
        });
    }
  }

  renderScreenshotSavedMessage() {
    if (this.state.screenshotTaken === true) {
      return <GoyemonText fontSize="14">Screenshot Saved!</GoyemonText>;
    }
  }

  renderScreenshotButtons() {
    const { permissions } = this.props;
    if (
      permissions.photoLibrary === '' ||
      permissions.photoLibrary === 'denied'
    ) {
      return (
        <Button
          text="Take a Screenshot"
          textColor="#00A3E2"
          backgroundColor="#FFF"
          borderColor="#00A3E2"
          margin="8px auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            this.requestPhotoLibraryPermission();
          }}
        />
      );
    } else if (
      permissions.photoLibrary === 'unavailable' ||
      permissions.photoLibrary === 'blocked'
    ) {
      return (
        <Button
          text="Go To Device Settings"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="8px auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings://notification/Goyemon');
            } else if (Platform.OS === 'android') {
              AndroidOpenSettings.applicationSettings();
            }
          }}
        />
      );
    } else if (permissions.photoLibrary === 'granted') {
      return (
        <Button
          text="Tap to Capture!"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="8px auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            this.takeScreenShot();
          }}
        />
      );
    }
  }

  takeScreenShot() {
    captureScreen().then(
      uri => {
        this.setState({
          imageURI: uri,
          screenshotTaken: true,
          nextButtonShown: true,
          twoColor: '#FDC800',
          progressBarWidth: '40%'
        });
        CameraRoll.saveToCameraRoll(uri);
      },
      error => LogUtilities.logError('Oops, Something Went Wrong', error)
    );
  }

  renderNextButton() {
    if (this.state.nextButtonShown) {
      return (
        <Button
          text={I18n.t('button-next')}
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="8px auto"
          marginBottom="12px"
          opacity={1}
          onPress={() => {
            if (Platform.OS === 'ios') {
              this.props.navigation.navigate('NotificationPermissionTutorial');
            } else if (Platform.OS === 'android') {
              this.props.navigation.navigate('WalletCreation');
            }
          }}
        />
      );
    } else if (!this.state.nextButtonShown) {
      return null;
    }
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor={this.state.twoColor}
          threeColor="#eeeeee"
          marginRight="40%"
          width={this.state.progressBarWidth}
        />
        <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
          Save Backup Words
        </HeaderTwo>
        <Description marginBottom="8" marginLeft="8" marginTop="16">
          carefully save your backup words in order
        </Description>
        <ShowMnemonicWords />
        <Container
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="100%"
        >
          {this.renderScreenshotButtons()}
          <GoyemonText fontSize="14">OR</GoyemonText>
          <Button
            text="Verify Backup Words"
            textColor="#00A3E2"
            backgroundColor="#FFF"
            borderColor="#00A3E2"
            margin="8px auto"
            marginBottom="8px"
            opacity="1"
            onPress={() => this.props.navigation.navigate('VerifyMnemonic')}
          />
          <ScreenshotContainer>
            <ScreenshotImage source={{ uri: this.state.imageURI }} />
            {this.renderScreenshotSavedMessage()}
          </ScreenshotContainer>
          {this.renderNextButton()}
        </Container>
      </RootContainer>
    );
  }
}

const ScreenshotContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ScreenshotImage = styled.Image`
  height: 160;
  resize-mode: contain;
  width: 120;
`;

function mapStateToProps(state) {
  return {
    permissions: state.ReducerPermissions.permissions
  };
}

const mapDispatchToProps = {
  savePhotoLibraryPermission
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowMnemonic);
