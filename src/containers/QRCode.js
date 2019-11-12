'use strict';
import React, { Component } from 'react';
import { Clipboard, TouchableWithoutFeedback } from 'react-native';
import { RootContainer, UntouchableCardContainer, HeaderOne } from '../components/common';
import { connect } from 'react-redux';
import QRCodeSvg from 'react-native-qrcode-svg';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class QRCode extends Component {
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
          ><CopiedAddressText>Copied</CopiedAddressText></TouchableWithoutFeedback>
          <Icon
            name="check"
            size={24}
            color="#12BB4F"
          />
        </CopiedAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await this.writeToClipboard();
          }}
        ><CopyAddressText>Copy</CopyAddressText></TouchableWithoutFeedback>
      );
    }
  }

  render() {
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <HeaderOne marginTop="96">QRCode</HeaderOne>
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
          <QrCodeText>{checksumAddress}</QrCodeText>
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
  margin-top: 32px;
  margin-bottom: 32px;
`;

const QrCodeText = styled.Text`
  color: #5f5f5f;
  margin-bottom: 16px;
`;

const CopiedAddressContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

const CopiedAddressText = styled.Text`
  color: #12BB4F;
  font-size: 20px;
  margin-right: 4px;
`;

const CopyAddressText = styled.Text`
  color: #009DC4;
  font-size: 20px;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(QRCode);
