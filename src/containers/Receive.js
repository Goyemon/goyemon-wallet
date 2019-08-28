'use strict';
import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableWithoutFeedback, Image } from 'react-native';
import { RootContainer, HeaderOne, HeaderTwo } from '../components/common';
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
  }

  render() {
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <HeaderOne marginTop="96">Receive</HeaderOne>
        <CardContainer>
          <HeaderTwo fontSize="16px" marginBottom="4" marginTop="8">
            Address
          </HeaderTwo>
          <AddressContainer>
            <Text>{checksumAddress}</Text>
            <TouchableWithoutFeedback
              onPress={async () => {
                await this.onPress();
                this.writeToClipboard();
              }}
            >
              <Animatable.View ref={ref => (this.AnimationRef = ref)}>
                <Image style={{width: 32, height: 32}} resizeMode="contain" source={require('../../assets/copy_icon.png')} />
              </Animatable.View>
            </TouchableWithoutFeedback>
          </AddressContainer>
          <HeaderTwo fontSize="16px" marginBottom="4" marginTop="8">
            Qr Code
          </HeaderTwo>
          <QrCodeContainer>
            <QRCode value={checksumAddress} size={120} bgColor="#000" fgColor="#FFF" />
            <Text>Save the QR code</Text>
          </QrCodeContainer>
        </CardContainer>
      </RootContainer>
    );
  }
}

const CardContainer = styled.View`
  background: #fff;
  border-radius: 8px;
  margin: 16px auto;
  padding: 16px;
  width: 95%;
`;

const AddressContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const QrCodeContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
