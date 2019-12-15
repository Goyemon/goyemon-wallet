'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RootContainer,
  HeaderOne,
  UntouchableCardContainer,
  Button,
  HeaderTwo,
  Description,
  CrypterestText
} from '../components/common';
import { View, Linking, TouchableHighlight, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import { persistor } from '../store/store.js';
import { clearState } from '../actions/ActionClearState';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <RootContainer>
        <HeaderOne marginTop="64">Settings</HeaderOne>
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
                <HeaderTwo marginBottom="0" marginLeft="0" marginTop="40">
                  Reset your Wallet?
                </HeaderTwo>
                <Description marginBottom="8" marginLeft="0" marginTop="16">
                  Make sure you save your backup words before deletion. Otherwise, you will lose
                  your funds.
                </Description>
                <ButtonContainer>
                  <Button
                    text="Cancel"
                    textColor="#5F5F5F"
                    backgroundColor="#EEEEEE"
                    borderColor="#EEEEEE"
                    margin="8px"
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
                    margin="8px"
                    opacity="1"
                    onPress={async () => {
                      await WalletUtilities.resetKeychainData();
                      await persistor.purge();
                      this.props.clearState();
                      // reset notification settings using https://github.com/zo0r/react-native-push-notification
                      this.setModalVisible(false);
                      this.props.navigation.navigate('Initial');
                    }}
                  />
                </ButtonContainer>
              </MondalInner>
            </ModalBackground>
          </ModalContainer>
        </Modal>
        <CommunityIconContainer>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL('https://twitter.com/taisuke_mino').catch(err =>
                  console.error('An error occurred', err)
                );
              }}
              name="twitter"
              color="#00aced"
              size={40}
            />
          </CommunityIcon>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL('https://github.com/taisukemino').catch(err =>
                  console.error('An error occurred', err)
                );
              }}
              name="github-circle"
              color="#333"
              size={40}
            />
          </CommunityIcon>
          <CommunityIcon>
            <Icon
              onPress={() => {
                Linking.openURL('https://discord.gg/MXGfnJG').catch(err =>
                  console.error('An error occurred', err)
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
          <SettingsList>
            <Icon name="information-outline" color="#5F5F5F" size={28} />
            <SettingsListText>FAQ</SettingsListText>
            <Icon name="chevron-right" color="#5F5F5F" size={28} />
          </SettingsList>
          <SettingsList>
            <Icon name="face" color="#5F5F5F" size={28} />
            <SettingsListText>About Us</SettingsListText>
            <Icon name="chevron-right" color="#5F5F5F" size={28} />
          </SettingsList>
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
  flexDirection: row;
  justifyContent: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #fff;
  border-radius: 16px;
  borderTopWidth: 2;
  borderTopColor: #e41b13;
  height: 30%;
  min-height: 280px;
  margin-top: 200px;
  width: 90%;
`;

const MondalInner = styled.View`
  justifyContent: center;
  flex: 1;
  flexDirection: column;
`;

const CommunityIconContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  margin-top: 32px;
`;

const CommunityIcon = styled.View`
  margin-left: 8px;
  margin-right: 8px;
`;

const SettingsListContainer = styled.View`
  background: #fff;
  border-color: rgba(95, 95, 95, 0.3);
  borderTopWidth: 0.5;
  borderBottomWidth: 0.5;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
`;

const SettingsList = styled.View`
  alignItems: center;
  border-color: rgba(95, 95, 95, 0.3);
  borderTopWidth: 0.5;
  borderBottomWidth: 0.5;
  flexDirection: row;
  justifyContent: space-between;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  width: 100%;
`;

const SettingsListText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20px;
  margin-left: 16px;
  width: 80%;
`;

const ResetWalletText = styled.Text`
  color: #e41b13;
  font-family: 'HKGrotesk-Regular';
  font-size: 24px;
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

const BottomText = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-bottom: 24px;
`;

const VersionText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  margin-bottom: 40px;
`;

const LoveText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
`;

const mapDispatchToProps = {
  clearState
};

export default connect(
  null,
  mapDispatchToProps
)(Settings);
