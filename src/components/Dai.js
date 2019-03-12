'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Header } from './common';

export default class Import extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Text>Dai</Text>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
