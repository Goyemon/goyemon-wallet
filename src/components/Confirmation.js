'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class Import extends Component {
  render() {
    return (
      <View>
      <Text>Gas Fee</Text>
      <Text>Total</Text>
      <Button
        title="Cancel"
        onPress={() => this.props.navigation.navigate('')}
      />
      <Button
        title="Confirm"
        onPress={() => this.props.navigation.navigate('')}
      />
      </View>
    );
  }
}
