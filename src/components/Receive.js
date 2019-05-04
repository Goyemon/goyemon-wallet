'use strict';
import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableWithoutFeedback } from 'react-native';
import { Header } from './common';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import * as Animatable from 'react-native-animatable';

class Receive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipboardContent: null
    };
    this.AnimationRef;
  }

  onPress() {
    this.AnimationRef.jello();
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.checksumAddress);
  };

  render() {
    const checksumAddress = this.props.checksumAddress;
    return (
      <View>
        <Text>Address: {checksumAddress}</Text>
        <TouchableWithoutFeedback onPress={async () => { await this.onPress(); this.writeToClipboard()}}>
          <Animatable.View ref={ref => (this.AnimationRef = ref)}>
            <Text>Copy Address</Text>
          </Animatable.View>
        </TouchableWithoutFeedback>
        <QRCode value={checksumAddress} size={200} bgColor="#000" fgColor="#FFF" />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
