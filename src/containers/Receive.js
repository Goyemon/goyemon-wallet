'use strict';
import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableWithoutFeedback, Image } from 'react-native';
import { Header } from '../components/common';
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
      <View>
        <CardContainerWithoutFeedback>
          <AddressContainer>
            <Text>Address: {checksumAddress}</Text>
            <TouchableWithoutFeedback onPress={async () => { await this.onPress(); this.writeToClipboard()}}>
              <Animatable.View ref={ref => (this.AnimationRef = ref)}>
                <Image source={require('../../assets/copy_icon.png')} />
              </Animatable.View>
            </TouchableWithoutFeedback>
          </AddressContainer>
        </CardContainerWithoutFeedback>
        <CardContainerWithoutFeedback>
          <QRCodeContainer>
            <QRCode value={checksumAddress} size={200} bgColor="#000" fgColor="#FFF" />
          </QRCodeContainer>
        </CardContainerWithoutFeedback>
      </View>
    );
  }
}

const CardContainerWithoutFeedback = styled.View`
  width: 160px;
  border-radius: 8px;
  background: #FFF;
  width: 360px;
  height: 200px;
  margin: 24px 16px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const AddressContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const QRCodeContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
