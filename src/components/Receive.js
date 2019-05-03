'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import { connect } from "react-redux";
import QRCode from 'react-native-qrcode';

class Receive extends Component {
  render() {
    const checksumAddress = this.props.checksumAddress;
    return (
      <View>
      <Text>Address: {checksumAddress}</Text>
      <Text>Copy Address</Text>
        <QRCode value={checksumAddress} size={200} bgColor="#000" fgColor="#FFF" />
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
