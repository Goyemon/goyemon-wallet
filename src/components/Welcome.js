'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.textStyle}>
        <Text>What Is Up, buddy!</Text>
        <Button title="Start" onPress={() => this.props.navigation.navigate('Start')} />
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
