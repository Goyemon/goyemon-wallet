'use strict';
import React, { Component } from 'react';
import { View, Image, Linking } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import CameraRoll from '@react-native-community/cameraroll';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { captureScreen } from 'react-native-view-shot';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import {
  RootContainer,
  ProgressBar,
  Button,
  HeaderTwo,
  CrypterestText
} from '../components/common';
import { savePhotoLibraryPermission } from '../actions/ActionPermissions';
import ShowMnemonicWords from '../containers/ShowMnemonicWords';
import LogUtilities from '../utilities/LogUtilities.js';

class MnemonicWordsScreenshot extends Component {
  constructor() {
    super();
    this.state = {
      imageURI: undefined,
      screenshotTaken: false,
      nextButtonDisabled: true,
      nextButtonOpacity: 0.5
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
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.props.savePhotoLibraryPermission('unavailable');
              LogUtilities.logInfo(
                'This feature is not available (on this device / in this context)'
              );
              break;
            case RESULTS.DENIED:
              this.props.savePhotoLibraryPermission('denied');
              LogUtilities.logInfo(
                'The permission has not been requested / is denied but requestable'
              );
              break;
            case RESULTS.GRANTED:
              this.props.savePhotoLibraryPermission('granted');
              LogUtilities.logInfo('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              this.props.savePhotoLibraryPermission('blocked');
              LogUtilities.logInfo('The permission is denied and not requestable anymore');
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
              this.props.savePhotoLibraryPermission('unavailable');
              LogUtilities.logInfo(
                'This feature is not available (on this device / in this context)'
              );
              break;
            case RESULTS.DENIED:
              this.props.savePhotoLibraryPermission('denied');
              LogUtilities.logInfo(
                'The permission has not been requested / is denied but requestable'
              );
              break;
            case RESULTS.GRANTED:
              this.props.savePhotoLibraryPermission('granted');
              LogUtilities.logInfo('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              this.props.savePhotoLibraryPermission('blocked');
              LogUtilities.logInfo('The permission is denied and not requestable anymore');
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
      return <CrypterestText fontSize="14">Screenshot Saved!</CrypterestText>;
    }
  }

  renderScreenshotButtons() {
    if (
      this.props.permissions.photoLibrary === '' ||
      this.props.permissions.photoLibrary === 'denied'
    ) {
      return (
        <Button
          text="Take a Screenshot"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="0 auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            this.requestPhotoLibraryPermission();
          }}
        />
      );
    } else if (
      this.props.permissions.photoLibrary === 'unavailable' ||
      this.props.permissions.photoLibrary === 'blocked'
    ) {
      return (
        <Button
          text="Go To Device Settings"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="0 auto"
          marginBottom="12px"
          opacity="1"
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings://notification/Crypterest');
            } else if (Platform.OS === 'android') {
              AndroidOpenSettings.applicationSettings();
            }
          }}
        />
      );
    } else if (this.props.permissions.photoLibrary === 'granted') {
      return (
        <Button
          text="Tap to Capture!"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#F8F8F8"
          disabled={false}
          margin="0 auto"
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
          nextButtonDisabled: false,
          nextButtonOpacity: 1
        });
        CameraRoll.saveToCameraRoll(uri);
      },
      error => LogUtilities.logError('Oops, Something Went Wrong', error)
    );
  }

  render() {
    return (
      <RootContainer>
        <ProgressBar
          oneColor="#FDC800"
          twoColor="#FDC800"
          threeColor="#eeeeee"
          marginRight="40%"
          width="40%"
        />
        <HeaderTwo marginBottom="16" marginLeft="0" marginTop="24">
          Save Backup Words
        </HeaderTwo>
        <ShowMnemonicWords />
        <ScreenshotContainer>
          {this.renderScreenshotButtons()}
          <ScreenshotImage source={{ uri: this.state.imageURI }} />
          {this.renderScreenshotSavedMessage()}
       </ScreenshotContainer>
        <Button
          text="Next"
          textColor="#00A3E2"
          backgroundColor="#F8F8F8"
          borderColor="#00A3E2"
          disabled={this.state.nextButtonDisabled}
          margin="8px auto"
          marginBottom="12px"
          opacity={this.state.nextButtonOpacity}
          onPress={() => {
            if (Platform.OS === 'ios') {
              this.props.navigation.navigate('NotificationPermissionTutorial');
            } else if (Platform.OS === 'android') {
              this.props.navigation.navigate('WalletCreation');
            }
          }}
        />
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 90%;
`;

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MnemonicWordsScreenshot);
