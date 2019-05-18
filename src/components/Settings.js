'use strict';
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class Settings extends Component {
  render() {
    return (
      <View>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Header headerStyle={{marginTop:16}}/>
          <SettingsList.Header headerStyle={{marginTop:16}}/>
        </SettingsList>
      </View>
    );
  }
}
