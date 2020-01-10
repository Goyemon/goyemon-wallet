'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Clipboard, TouchableWithoutFeedback } from 'react-native';
import QRCodeSvg from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  CrypterestText
} from '../components/common';

class Receive extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.checksumAddress);
    this.setState({ clipboardContent: this.props.checksumAddress });
  }

  renderCopyText() {
    if (this.state.clipboardContent === this.props.checksumAddress) {
      return (
        <CopiedAddressContainer>
          <TouchableWithoutFeedback
            onPress={async () => {
              await this.writeToClipboard();
            }}
          >
            <CopiedAddressText>Copied</CopiedAddressText>
          </TouchableWithoutFeedback>
          <Icon name="check" size={24} color="#00A3E2" />
        </CopiedAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await this.writeToClipboard();
          }}
        >
          <CopyAddressText>Copy</CopyAddressText>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <HeaderOne marginTop="96">Receive</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="column"
          height="360px"
          justifyContent="center"
          marginTop="32px"
          textAlign="left"
          width="100%"
        >
          <QrCodeContainer>
            <QrCodeText>Your QR Code</QrCodeText>
            <QRCodeSvg value={checksumAddress} size={120} />
          </QrCodeContainer>
          <QrCodeText>Your Address</QrCodeText>
          <CrypterestText fontSize="14">{checksumAddress}</CrypterestText>
          {this.renderCopyText()}
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const QrCodeContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-top: 32;
  margin-bottom: 32;
`;

const QrCodeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  font-weight: bold;
  margin-bottom: 8;
`;

const CopiedAddressContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const CopiedAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-right: 4;
`;

const CopyAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
