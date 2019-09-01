'use strict';
import React, { Component } from 'react';
import { Text, Clipboard } from 'react-native';
import { RootContainer, HeaderOne, Button } from '../components/common';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import styled from 'styled-components/native';

class Receive extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
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
          <QrCodeContainer>
            <QRCode value={checksumAddress} size={120} bgColor="#000" fgColor="#FFF" />
          </QrCodeContainer>
          <AddressText>{checksumAddress}</AddressText>
          <Button
            text="Copy Wallet Address"
            textColor="#4E4E4E"
            backgroundColor="#EEEEEE"
            margin="16px auto"
            opacity="1"
            onPress={async () => {
              this.writeToClipboard();
              }
            }
          />
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

const QrCodeContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-bottom: 32px;
`;

const AddressText = styled.Text`
  color: #4E4E4E;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
