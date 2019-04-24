'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Header } from './common';

export default class Import extends Component {
  render() {
    return (
      <View>
      <Text>From</Text>
      <Text>To</Text>
      <Text>Amount</Text>
      <Text>Transaction Fee</Text>
        <Button
          title="Send"
          onPress={() => this.props.navigation.navigate('Confirmation')}
        />
      </View>
    );
  }
}
