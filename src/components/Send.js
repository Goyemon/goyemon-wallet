'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Header } from './common';

export default class Import extends Component {
  render() {
    return (
      <View>
        <Button
          title="Send"
          onPress={() => this.props.navigation.navigate('Confirmation')}
        />
      </View>
    );
  }
}
