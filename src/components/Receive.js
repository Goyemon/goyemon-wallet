'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import { connect } from "react-redux";

class Receive extends Component {
  render() {
    const checksumAddress = this.props.checksumAddress;
    return (
      <View>
      <Text>Address: {checksumAddress}</Text>
      <Text>Copy Address</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  };
}

export default connect(mapStateToProps)(Receive);
