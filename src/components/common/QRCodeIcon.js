'use strict';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

const QRCodeIcon = props => (
  <IconContainer>
    <Icon name="qrcode" color="#000" onPress={props.onPress} size={32} />
  </IconContainer>
);

const IconContainer = styled.View`
  margin-top: 8;
  margin-right: 16;
`;

export { QRCodeIcon };
