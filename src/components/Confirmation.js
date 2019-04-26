'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../components/common/Button';

export default class Import extends Component {
  render() {
    return (
      <View>
      <Text>Gas Fee</Text>
      <Text>Total</Text>
      <Button text="Cancel" textColor="white" backgroundColor="grey" onPress={() => this.props.navigation.navigate('')} />
      <Button text="Confirm" textColor="white" backgroundColor="#01d1e5" onPress={() => this.props.navigation.navigate('')} />
      </View>
    );
  }
}
