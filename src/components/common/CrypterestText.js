'use strict';
import React from 'react';
import styled from 'styled-components/native';

const CrypterestText = props => <HKGroteskText fontSize={props.fontSize}>{props.children}</HKGroteskText>;

const HKGroteskText = styled.Text`
  color: #5F5F5F;
  font-family: 'HKGrotesk-Regular';
  font-size: ${props => props.fontSize};
  margin-top: 8px;
  margin-bottom: 8px;
`;

export { CrypterestText };
