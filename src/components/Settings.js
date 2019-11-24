'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RootContainer,
  HeaderOne,
  UntouchableCardContainer,
  Button,
  HeaderTwo,
  Description
} from '../components/common';
import { View, Text, Linking, TouchableHighlight, Alert, Modal } from 'react-native';
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
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <ModalContainer>
            <ModalBackground>
              <HeaderTwo
                marginBottom="0"
                marginLeft="0"
                marginTop="40"
              >
                Reset your Wallet?
              </HeaderTwo>
              <Description marginBottom="8" marginLeft="0" marginTop="16">Make sure you save your backup words before deletion. Otherwise, you will lose your funds.</Description>
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
                  backgroundColor="#FF3346"
                  borderColor="#FF3346"
                  margin="8px"
                  opacity="1"
                  onPress={async () => {
                    await WalletUtilities.resetKeychainData();
                    await persistor.purge();
                    this.props.clearState();
                    // reset notification settings
                    // https://github.com/zo0r/react-native-push-notification
                    this.setModalVisible(false);
                    this.props.navigation.navigate('Initial');
                  }}
                />
              </ButtonContainer>
            </ModalBackground>
          </ModalContainer>
        </Modal>
        <CommunityIconContainer>
          <CommunityIcon><Icon onPress={() => {Linking.openURL('https://twitter.com/taisuke_mino')}} name="twitter" color="#00aced" size={40} /></CommunityIcon>
          <CommunityIcon><Icon onPress={() => {Linking.openURL('https://github.com/taisukemino')}} name="github-circle" color="#333" size={40} /></CommunityIcon>
          <CommunityIcon><Icon onPress={() => {Linking.openURL('https://discord.gg/mtbXB2')}} name="discord" color="#7289DA" size={40} /></CommunityIcon>
        </CommunityIconContainer>
        <Description
          marginBottom="40"
          marginLeft="8"
          marginTop="16"
        >
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
        <VersionText><Text>v0.0.1</Text></VersionText>
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
  background-color: #FFF;
  borderTopWidth: 2;
  borderTopColor: #FF3346;
  height: 30%;
  min-height: 280px;
  margin-top: 200px;
  width: 90%;
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
  border-width: 0.5;
  margin-bottom: 8px;
  margin-top: 16px;
  width: 100%;
`;

const SettingsList = styled.View`
  alignItems: center;
  border-color: rgba(95, 95, 95, 0.3);
  border-width: 0.5;
  flexDirection: row;
  justifyContent: space-between;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-top: 16px;
  width: 100%;
`;

const SettingsListText = styled.Text`
  color: #5F5F5F;
  font-size: 20px;
  margin-left: 16px;
  width: 80%;
`;

const ResetWalletText = styled.Text`
  color: #ff3346;
  font-size: 24px;
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

const VersionText = styled.View`
  flexDirection: row;
  justifyContent: center;
`;

const mapDispatchToProps = {
  clearState
};

export default connect(
  null,
  mapDispatchToProps
)(Settings);
