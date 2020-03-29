'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Linking, TouchableHighlight, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import { clearState } from '../actions/ActionClearState';
import { rehydrationComplete } from '../actions/ActionRehydration';
import {
  RootContainer,
  HeaderOne,
  UntouchableCardContainer,
  Button,
  Description
} from '../components/common';
import I18n from '../i18n/I18n';
import TxStorage from '../lib/tx';
import { persistor, store } from '../store/store.js';
import LogUtilities from '../utilities/LogUtilities.js';
import WalletUtilities from '../utilities/WalletUtilities.ts';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      deleteTextValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    };
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
  }

  validateDeleteText(deleteText) {
    if (deleteText === 'delete') {
      LogUtilities.logInfo('the delete text validated!');
      this.setState({
        deleteTextValidation: true,
        buttonDisabled: false,
        buttonOpacity: 1
      });
      return true;
    }
    LogUtilities.logInfo('wrong delete text!');
    this.setState({
      deleteTextValidation: false,
      buttonDisabled: true,
      buttonOpacity: 0.5
    });
    return false;
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="112">Settings</HeaderOne>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <ModalContainer>
            <ModalBackground>
              <MondalInner>
                <ModalTextContainer>
                  <ResetWalletHeader>
                    {I18n.t('Are you sure?')}
                  </ResetWalletHeader>
                  <Description marginBottom="8" marginLeft="0" marginTop="16">
                    Did you save your backup words? Otherwise, you will lose
                    your funds.
                  </Description>
                </ModalTextContainer>
                <DeleteTextInputContainer>
                  <Description marginBottom="8" marginLeft="0" marginTop="16">
                    type "delete" to confirm
                  </Description>
                  <DeleteTextInput
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                    onChangeText={deleteText => {
                      this.validateDeleteText(deleteText);
                    }}
                  />
                </DeleteTextInputContainer>
                <ButtonContainer>
                  <Button
                    text="Cancel"
                    textColor="#5F5F5F"
                    backgroundColor="#EEEEEE"
                    borderColor="#EEEEEE"
                    margin="8px"
                    marginBottom="12px"
                    opacity="1"
                    onPress={() => {
                      this.setModalVisible(false);
                    }}
                  />
                  <Button
                    text="Confirm"
                    textColor="#FFF"
                    backgroundColor="#E41B13"
                    borderColor="#E41B13"
                    disabled={this.state.buttonDisabled}
                    margin="8px"
                    marginBottom="12px"
                    opacity={this.state.buttonOpacity}
                    onPress={async () => {
                      await WalletUtilities.resetKeychainData();
                      await persistor.purge();
                      await TxStorage.storage.clear();
                      this.props.clearState();
                      // reset notification settings using https://github.com/zo0r/react-native-push-notification
                      this.setModalVisible(false);
                      this.props.navigation.navigate('Initial');
                      store.dispatch(rehydrationComplete(true));
                    }}
                  />
                </ButtonContainer>
              </MondalInner>
            </ModalBackground>
          </ModalContainer>
        </Modal>
        <CommunityIconContainer>
          <CommunityIcon>
            <IconOpacity>
              <Icon
                onPress={() => {
                  Linking.openURL('#').catch(err =>
                    LogUtilities.logError('An error occurred', err)
                  );
                }}
                name="twitter"
                color="#5f5f5f"
                size={40}
              />
            </IconOpacity>
          </CommunityIcon>
          <CommunityIcon>
            <IconOpacity>
              <Icon
                onPress={() => {
                  Linking.openURL('#').catch(err =>
                    LogUtilities.logError('An error occurred', err)
                  );
                }}
                name="github-circle"
                color="#5f5f5f"
                size={40}
              />
            </IconOpacity>
          </CommunityIcon>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL('https://discord.gg/MXGfnJG').catch(err =>
                  LogUtilities.logError('An error occurred', err)
                );
              }}
              name="discord"
              color="#7289DA"
              size={40}
            />
          </CommunityIcon>
        </CommunityIconContainer>
        <Description marginBottom="40" marginLeft="8" marginTop="16">
          Join the community
        </Description>
        <SettingsListContainer>
          <TouchableHighlight
            underlayColor="#FFF"
            onPress={() => this.props.navigation.navigate('BackupWords')}
          >
            <SettingsList>
              <Icon name="key-outline" color="#5F5F5F" size={28} />
              <SettingsListText>Backup Words</SettingsListText>
              <Icon name="chevron-right" color="#5F5F5F" size={28} />
            </SettingsList>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="#FFF"
            onPress={() => this.props.navigation.navigate('Advanced')}
          >
            <SettingsList>
              <Icon name="crosshairs" color="#5F5F5F" size={28} />
              <SettingsListText>Advanced</SettingsListText>
              <Icon name="chevron-right" color="#5F5F5F" size={28} />
            </SettingsList>
          </TouchableHighlight>
        </SettingsListContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="column"
          height="80px"
          justifyContent="center"
          marginTop="40"
          textAlign="center"
          width="100%"
        >
          <TouchableHighlight
            underlayColor="#FFF"
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <ResetWalletText>Reset Wallet</ResetWalletText>
          </TouchableHighlight>
        </UntouchableCardContainer>
        <BottomText>
          <VersionText>v0.0.1</VersionText>
          <Icon name="heart-outline" color="#5f5f5f" size={24} />
          <LoveText>Made with love by Swarm</LoveText>
        </BottomText>
      </RootContainer>
    );
  }
}

const ModalContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #f8f8f8;
  border-radius: 16px;
  border-top-width: 2;
  border-top-color: #e41b13;
  height: 30%;
  min-height: 320px;
  margin-top: 80;
  width: 90%;
`;

const MondalInner = styled.View`
  justify-content: center;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const ModalTextContainer = styled.View`
  margin: 0 auto;
  width: 90%;
`;

const CommunityIconContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 32;
`;

const CommunityIcon = styled.View`
  margin-left: 8;
  margin-right: 8;
`;

const IconOpacity = styled.View`
  opacity: 0.4;
`;

const SettingsListContainer = styled.View`
  background: #fff;
  border-color: rgba(95, 95, 95, 0.3);
  border-top-width: 0.5;
  border-bottom-width: 0.5;
  margin-top: 16;
  margin-bottom: 8;
  width: 100%;
`;

const SettingsList = styled.View`
  align-items: center;
  border-color: rgba(95, 95, 95, 0.3);
  border-top-width: 0.5;
  border-bottom-width: 0.5;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  width: 100%;
`;

const SettingsListText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-left: 16;
  width: 80%;
`;

const ResetWalletHeader = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  font-size: 24;
  margin-top: 16;
  text-align: center;
  text-transform: uppercase;
`;

const ResetWalletText = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const DeleteTextInputContainer = styled.View`
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
`;

const DeleteTextInput = styled.TextInput`
  background-color: #fff;
  border-color: rgba(95, 95, 95, 0.3);
  border-width: 1;
  font-size: 16;
  padding: 8px 12px;
  text-align: left;
  min-width: 120;
  width: 100%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
`;

const BottomText = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24;
`;

const VersionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 40;
`;

const LoveText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 48;
`;

const mapDispatchToProps = {
  clearState
};

export default connect(null, mapDispatchToProps)(Settings);
