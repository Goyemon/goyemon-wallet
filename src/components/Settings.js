'use strict';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Header } from './common';

export default class Settings extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Text>Notifications</Text>
        <Text>Help</Text>
        <Text>About</Text>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};
