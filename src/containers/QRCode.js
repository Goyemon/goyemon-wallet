'use strict';
import React, { Component } from 'react';
import { Text, Clipboard } from 'react-native';
import { RootContainer, UntouchableCardContainer, Button, HeaderOne } from '../components/common';
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
    this.setState({clipboardContent: this.props.checksumAddress});
  }

  renderCheckmark() {
    if(this.state.clipboardContent === null){
      return ;
    } else if (this.state.clipboardContent === this.props.checksumAddress){
      return <Icon name="check" size={24} color="#12BB4F" />;
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
          <CopyAddressContainer>
            <Button
              text="Copy Wallet Address"
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              borderColor="#EEEEEE"
              margin="16px auto"
              opacity="1"
              onPress={async () => {
                await this.writeToClipboard();
                }
              }
            />
            {this.renderCheckmark()}
          </CopyAddressContainer>
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
  color: #5F5F5F;
  margin-bottom: 8px;
`;

const CopyAddressContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(QRCode);
