"use strict";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";

const QRCodeIcon = (props) => (
  <QRCodeIconContainer>
    <Icon name="qrcode" color="#000" onPress={props.onPress} size={32} />
  </QRCodeIconContainer>
);

const QRCodeIconContainer = styled.View`
  margin-top: 8;
  margin-right: 16;
`;

const ReceiveIcon = (props) => (
  <ReceiveIconContainer onPress={props.onPress}>
    <Icon name="qrcode" color="#fff" size={20} />
  </ReceiveIconContainer>
);

const ReceiveIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #323944;
  border-radius: 40px;
  height: 40px;
  width: 40px;
`;

const CopyIcon = () => (
  <CopyIconContainer>
    <Icon name="content-copy" size={18} color="#fff" />
  </CopyIconContainer>
);

const CopyIconContainer = styled.View`
  align-items: center;
  background-color: #667689;
  border-radius: 40px;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

const BuyIcon = (props) => (
  <BuyIconContainer onPress={props.onPress}>
    <Icon name="swap-vertical" color="#fff" size={24} />
  </BuyIconContainer>
);

const BuyIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #a9c973;
  border-radius: 40px;
  height: 40px;
  width: 40px;
`;

export { QRCodeIcon, ReceiveIcon, CopyIcon, BuyIcon };
