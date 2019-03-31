'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Header } from './common';

export default class Import extends Component {
  render() {
    return (
      <View>
      <View style={styles.textStyle}>
        <Text>0 ETH</Text>
      </View>
      <View>
        <Button
          title="Send"
          onPress={() => this.props.navigation.navigate('Send')}
        />
      </View>
      <View>
        <Button
          title="Receive"
          onPress={() => this.props.navigation.navigate('Receive')}
        />
        </View>
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
