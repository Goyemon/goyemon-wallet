'use strict';
import React from 'react';
import styled from 'styled-components/native';

const GoyemonText = (props) => (
  <HKGroteskText fontSize={props.fontSize} onPress={props.onPress}>
    {props.children}
  </HKGroteskText>
);

const HKGroteskText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: ${(props) => props.fontSize};
`;

const ConfirmationText = (props) => <Text>{props.children}</Text>;

const Text = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Bold';
  font-size: 20;
  margin-top: 4;
  margin-bottom: 24;
`;

export { GoyemonText, ConfirmationText };
