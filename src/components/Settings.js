'use strict';
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { RootContainer, HeaderOne } from '../components/common';
import SettingsList from 'react-native-settings-list';

export default class Settings extends Component {
  render() {
    return (
      <RootContainer>
        <HeaderOne  marginTop="96">Settings</HeaderOne>
        <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
          <SettingsList.Header headerStyle={{ marginTop: 16 }} />
          <SettingsList.Header headerStyle={{ marginTop: 16 }} />
        </SettingsList>
      </RootContainer>
    );
  }
}
