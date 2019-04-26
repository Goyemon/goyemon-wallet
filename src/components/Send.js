'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import { Button } from '../components/common/Button';

export default class Import extends Component {
  render() {
    return (
      <View>
      <Text>From</Text>
      <Text>To</Text>
      <Text>Amount</Text>
      <Text>Transaction Fee</Text>
        <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={() => this.props.navigation.navigate('Confirmation')} />
      </View>
    );
  }
}
