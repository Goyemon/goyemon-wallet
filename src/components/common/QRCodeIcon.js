'use strict';
import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QRCodeIcon = props => (
  <IconContainer>
    <Icon name="qrcode" color="#000" onPress={props.onPress} size={32} />
  </IconContainer>
);

const IconContainer = styled.View`
  margin-top: 8px;
  margin-right: 16px;
`;

export { QRCodeIcon };
