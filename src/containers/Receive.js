'use strict';
import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableWithoutFeedback, Image } from 'react-native';
import { RootContainer, UntouchableCardContainer, HeaderOne } from '../components/common';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';

class Receive extends Component {
  constructor(props) {
    super();
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
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <HeaderOne>Receive</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          flexDirection="column"
          height="240px"
          justifyContent="flex-start"
          textAlign="left"
          width="95%"
         >
          <Text>Address: {checksumAddress}</Text>
          <TouchableWithoutFeedback onPress={async () => { await this.onPress(); this.writeToClipboard()}}>
            <Animatable.View ref={ref => (this.AnimationRef = ref)}>
              <Image source={require('../../assets/copy_icon.png')} />
            </Animatable.View>
          </TouchableWithoutFeedback>
          <QRCode value={checksumAddress} size={120} bgColor="#000" fgColor="#FFF" />
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
