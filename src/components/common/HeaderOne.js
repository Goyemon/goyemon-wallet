'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderOne = (props) => (
  <HeaderOneText marginTop={props.marginTop}>{props.children}</HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32;
  font-family: 'HKGrotesk-Bold';
  margin-left: 16;
  margin-top: ${(props) => `${props.marginTop}`};
`;

export { HeaderOne };
