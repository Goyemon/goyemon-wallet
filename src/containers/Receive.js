'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QRCodeSvg from 'react-native-qrcode-svg';
import styled from 'styled-components/native';
import {
  RootContainer,
  UntouchableCardContainer,
  GoyemonText
} from '../components/common';
import Copy from '../containers/common/Copy';
import I18n from '../i18n/I18n';

class Receive extends Component {
  render() {
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="0"
          flexDirection="column"
          height="360px"
          justifyContent="center"
          marginTop="128"
          textAlign="left"
          width="100%"
        >
          <QrCodeContainer>
            <QrCodeText>{I18n.t('portfolio-receive-qrcode')}</QrCodeText>
            <QRCodeSvg value={checksumAddress} size={120} />
          </QrCodeContainer>
          <QrCodeText>{I18n.t('portfolio-receive-address')}</QrCodeText>
          <GoyemonText fontSize="14">{checksumAddress}</GoyemonText>
          <Copy text={checksumAddress} icon={false} />
        </UntouchableCardContainer>
      </RootContainer>
    );
  }
}

const QrCodeContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 32;
`;

const QrCodeText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  font-weight: bold;
  margin-bottom: 8;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
