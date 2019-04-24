'use strict';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>Holla!</Text>
        <Text style={styles.textStyle}>ARE YOU READY?</Text>
        <Button title="Hell Yeah!" onPress={() => this.props.navigation.navigate('Start')} />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 40
  }
};
