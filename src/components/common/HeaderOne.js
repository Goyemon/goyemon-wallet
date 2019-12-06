'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderOne = props => (
  <HeaderOneText marginTop={props.marginTop}>{props.children}</HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32px;
  font-family: 'HKGrotesk-Bold';
  margin-left: 16px;
  margin-top: ${props => `${props.marginTop}px`};
`;

export { HeaderOne };
