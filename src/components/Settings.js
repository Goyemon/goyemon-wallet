'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RootContainer,
  HeaderOne,
  UntouchableCardContainer,
  Button,
  OneLiner
} from '../components/common';
import { View, Text, Modal, TouchableHighlight, Alert } from 'react-native';
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
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={{ marginTop: 22 }}>
            <OneLiner
              fontSize="24px"
              fontWeight="normal"
              marginBottom="0"
              marginLeft="0"
              marginTop="96"
            >
              Delete Accounts?
            </OneLiner>
            <ButtonContainer>
              <Button
                text="Cancel"
                textColor="#5F5F5F"
                backgroundColor="#EEEEEE"
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
                margin="8px"
                opacity="1"
                onPress={async () => {
                  await WalletUtilities.resetKeychainData();
                  await persistor.purge();
                  this.props.clearState();
                  this.setModalVisible(false);
                  this.props.navigation.navigate('Initial');
                }}
              />
            </ButtonContainer>
          </View>
        </Modal>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="160px"
          justifyContent="center"
          textAlign="left"
          width="100%"
        >
          <SettingsTextContainer>
            <Icon name="information-outline" color="#5F5F5F" size={32} />
            <SettingsText>About Us</SettingsText>
          </SettingsTextContainer>
          <SettingsTextContainer>
            <Icon name="message-text-outline" color="#5F5F5F" size={32} />
            <TouchableHighlight
              underlayColor="#FFF"
              onPress={() => this.props.navigation.navigate('BackupWords')}
            >
              <SettingsText>Backup Words</SettingsText>
            </TouchableHighlight>
          </SettingsTextContainer>
        </UntouchableCardContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="column"
          height="80px"
          justifyContent="center"
          textAlign="center"
          width="100%"
        >
          <TouchableHighlight
            underlayColor="#FFF"
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <DeleteAccountsText>Delete Accounts</DeleteAccountsText>
          </TouchableHighlight>
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const SettingsTextContainer = styled.View`
  flexDirection: row;
  margin-bottom: 8px;
  margin-left: 24px;
  margin-top: 16px;
`;

const SettingsText = styled.Text`
  color: #5F5F5F
  font-size: 24px;
  margin-left: 8px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

const DeleteAccountsText = styled.Text`
  color: #ff3346;
  font-size: 24px;
`;

const mapDispatchToProps = {
  clearState
};

export default connect(
  null,
  mapDispatchToProps
)(Settings);
